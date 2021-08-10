/**
 * SOES EEPROM generator
 * Code generation logic

* This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2021
 */
'use strict'

// ####################### ESI.xml generating ####################### //

function esiDTbitsize(dtype) {
	return ESI_DT[dtype].bitsize;
}

//See ETG2000 for ESI format
function esi_generator(form, od, indexes)
{
	//VendorID
	var esi =`<?xml version="1.0" encoding="UTF-8"?>\n<EtherCATInfo>\n  <Vendor>\n    <Id>${parseInt(form.VendorID.value).toString()}</Id>\n`;
	//VendorName
	esi += `    <Name LcId="1033">${form.VendorName.value}</Name>\n  </Vendor>\n  <Descriptions>\n`;
	//Groups
	esi += `    <Groups>\n      <Group>\n        <Type>${form.TextGroupType.value}</Type>\n        <Name LcId="1033">${form.TextGroupName5.value}</Name>\n      </Group>\n    </Groups>\n    <Devices>\n`;
	//Physics  
	esi += `      <Device Physics="${form.Port0Physical.value + form.Port1Physical.value + form.Port2Physical.value || + form.Port3Physical.value}">\n        <Type ProductCode="#x${parseInt(form.ProductCode.value).toString(16)}" RevisionNo="#x${parseInt(form.RevisionNumber.value).toString(16)}">${form.TextDeviceType.value}</Type>\n`;
	//Add  Name info
	esi += `        <Name LcId="1033">${form.TextDeviceName.value}</Name>\n`;
	//Add in between
	esi += `        <GroupType>${form.TextGroupType.value}</GroupType>\n`;
	//Add profile
	esi += `        <Profile>\n          <ProfileNo>${form.ProfileNo.value}</ProfileNo>\n          <AddInfo>0</AddInfo>\n          <Dictionary>\n            <DataTypes>`;
	const customTypes = {};
	const variableTypes = {};
	
	function addVariableType(element) {
		if (element && element.otype && (element.otype != OTYPE.VAR && element.otype != OTYPE.ARRAY)) { 
			alert(`${element.name} is not OTYPE VAR, cannot treat is as variable type`); return; 
		}
		if (!element || !element.dtype) {
			alert(`${element.name} has no DTYPE, cannot treat is as variable type`); return; 
		}		
		let el_name = esiVariableTypeName(element);
		if (!variableTypes[el_name]) {
			const bitsize = (element.dtype == DTYPE.VISIBLE_STRING) ? esiBitsize(element) : esiDTbitsize(element.dtype);
			variableTypes[el_name] = bitsize;
		}
	}
	function addObjectDictionaryDataType(od, index) {
		const objd = od[index];
		const dtName = esiDtName(objd, index);
		var result = '';

		if (objd.otype == OTYPE.VAR) {
			addVariableType(objd); // variable types will have to be be done later anyway, add to that queue
		} else if (!customTypes[dtName]) {
			// generate data types code for complex objects
			const bitsize = esiBitsize(objd);
			customTypes[dtName] = true;
			result += `\n              <DataType>`;
			
			let flags = `\n                    <Access>ro</Access>`; // PDO assign flags for variables are set in dictionary objects section
			if (objd.otype == OTYPE.ARRAY) {
				addVariableType(objd); // queue variable type to add after array code is generated
				let esi_type = ESI_DT[objd.dtype];
				let arr_bitsize = (objd.items.length - 1) * esi_type.bitsize
				result += `\n                <Name>${dtName}ARR</Name>\n                <BaseType>${esi_type.name}</BaseType>\n                <BitSize>${arr_bitsize}</BitSize>`;
				result += `\n                <ArrayInfo>\n                  <LBound>1</LBound>\n                  <Elements>${objd.items.length - 1}</Elements>\n                </ArrayInfo>`;
				result += `\n              </DataType>`;
				result += `\n              <DataType>`;
			}
			result += `\n                <Name>${dtName}</Name>\n                <BitSize>${bitsize}</BitSize>`;
			result += `\n                <SubItem>\n                  <SubIdx>0</SubIdx>\n                  <Name>Max SubIndex</Name>\n                  <Type>USINT</Type>`
				+ `\n                  <BitSize>8</BitSize>\n                  <BitOffs>0</BitOffs>\n                  <Flags>${flags}\n                  </Flags>\n                </SubItem>`;
			
			flags += getPdoMappingFlags(objd); // PDO assign flags for composite type
			
			switch (objd.otype) {
			case OTYPE.ARRAY: {
				let arr_bitsize = (objd.items.length - 1) * esiDTbitsize(objd.dtype);
				result += `\n                <SubItem>\n                  <Name>Elements</Name>\n                  <Type>${dtName}ARR</Type>\n                  <BitSize>${arr_bitsize}</BitSize>`
						+`\n                  <BitOffs>16</BitOffs>\n                  <Flags>${flags}\n                  </Flags>\n                </SubItem>`;
				break;
			} case OTYPE.RECORD: {
				let subindex = 0;
				let bits_offset = 16;
				objd.items.forEach(subitem => {
					if (subindex > 0) { // skipped Max Subindex
						addVariableType(subitem); // cannot add variable type now that record code is being generated
						let subitem_dtype = ESI_DT[subitem.dtype];
						let subitem_bitsize = subitem_dtype.bitsize
						const subitemFlags = getSubitemFlags(objd, subitem);
						result += `\n                <SubItem>\n                  <SubIdx>${subindex}</SubIdx>\n                  <Name>${subitem.name}</Name>` 
							+ `\n                  <Type>${subitem_dtype.name}</Type>\n                  <BitSize>${subitem_bitsize}</BitSize>\n                  <BitOffs>${bits_offset}</BitOffs>`
							+ `\n                  <Flags>${subitemFlags}\n                  </Flags>`
							+ `\n                </SubItem>`;
						bits_offset += subitem_bitsize;
					}
					subindex++;
				});
				break;
			} default: {
				alert(`Object ${index} "${objd.name}" has unexpected OTYPE ${objd.otype}`);
				alert;
			}}
			result += `\n              </DataType>`;
		}

		return result;

		function getSubitemFlags(objd, subitem) {
			let access = 'ro';
			let modifier = '';
			if (subitem.access) {
				access = subitem.access.slice(0,2).toLowerCase();
				modifier = ' WriteRestrictions="PreOP"';
			}
			let flags = `\n                    <Access${modifier}>${access}</Access>`; // PDO assign flags for variables are set in dictionary objects section
			flags += getPdoMappingFlags(objd); // PDO assign flags for composite type
			return flags;
		}
	}
	// Add objects dictionary data types
	indexes.forEach(index => { esi += addObjectDictionaryDataType(od, index); });
	// Add variable type
	Object.entries(variableTypes).forEach(variableType => {
		esi += `\n              <DataType>`;
		esi += `\n                <Name>${variableType[0]}</Name>\n                <BitSize>${variableType[1]}</BitSize>`;			
		esi += `\n              </DataType>`;
	});
	esi += `\n            </DataTypes>\n            <Objects>`;
	// Add objects dictionary
	function addDictionaryObject(od, index) {
		const objd = od[index];
		const el_dtype = esiDtName(objd, index);
		const bitsize = esiBitsize(objd);
		let result = `\n              <Object>\n                <Index>#x${index}</Index>\n                <Name>${objd.name}</Name>\n                <Type>${el_dtype}</Type>\n                <BitSize>${bitsize}</BitSize>\n                <Info>`;
		if (objd.data) {
			if (objd.dtype == DTYPE.VISIBLE_STRING) {
				result += `\n                  <DefaultString>${objd.data}</DefaultString>`;	
			}
		}
		if (objd.value) {
			result += `\n                  <DefaultValue>${toEsiHexValue(objd.value)}</DefaultValue>`;
		}
		//Add object subitems for complex types
		if (objd.items) {
			result += addDictionaryObjectSubitems(objd.items);
		}
	
		var flags = `\n                  <Access>ro</Access>`;
		if (objd.otype == OTYPE.VAR) {
			flags += getPdoMappingFlags(objd);
		}
		if (SDO_category[index]) { 
			flags += `\n                  <Category>${SDO_category[index]}</Category>`; 
		}
		result += `\n                </Info>\n                <Flags>${flags}\n                </Flags>\n              </Object>`;
		return result;

		function addDictionaryObjectSubitems(element_items) {
			const max_subindex_value = element_items.length - 1;
			var result = ""
			let subindex = 0;
			element_items.forEach(subitem => {
				var defaultValue = (subindex > 0) ? subitem.value : max_subindex_value;
				result += `\n                  <SubItem>\n                    <Name>${subitem.name}</Name>\n                    <Info>\n                      <DefaultValue>${toEsiHexValue(defaultValue)}</DefaultValue>\n                    </Info>\n                  </SubItem>`;
				subindex++;
			});
			return result;
		}
	}
	indexes.forEach(index => { esi += addDictionaryObject(od, index); });
	const is_rxpdo = isPdoWithVariables(od, indexes, rxpdo);
	const is_txpdo = isPdoWithVariables(od, indexes, txpdo);

	esi += `\n            </Objects>\n          </Dictionary>\n        </Profile>\n        <Fmmu>Outputs</Fmmu>\n        <Fmmu>Inputs</Fmmu>\n        <Fmmu>MBoxState</Fmmu>\n`;
	//Add Rxmailbox sizes
	esi += `        <Sm DefaultSize="${parseInt(form.MailboxSize.value).toString(10)}" StartAddress="#x${indexToString(form.RxMailboxOffset.value)}" ControlByte="#x26" Enable="1">MBoxOut</Sm>\n`;
	//Add Txmailbox sizes
	esi += `        <Sm DefaultSize="${parseInt(form.MailboxSize.value).toString(10)}" StartAddress="#x${indexToString(form.TxMailboxOffset.value)}" ControlByte="#x22" Enable="1">MBoxIn</Sm>\n`;
	//Add SM2
	esi += `        <Sm StartAddress="#x${indexToString(form.SM2Offset.value)}" ControlByte="#x24" Enable="${is_rxpdo ? 1 : 0}">Outputs</Sm>\n`;
	//Add SM3
	esi += `        <Sm StartAddress="#x${indexToString(form.SM3Offset.value)}" ControlByte="#x20" Enable="${is_txpdo ? 1 : 0}">Inputs</Sm>\n`;
	if (is_rxpdo) {
		var memOffset = getSM2_MappingOffset(form);
		indexes.forEach(index => {
			const objd = od[index];
			
			if (isInArray(objd.pdo_mappings, rxpdo)) {
				esi += addEsiDevicePDO(objd, index, rxpdo, memOffset);
				++memOffset;
			}	
		});
	}
	if (is_txpdo) {
		var memOffset = form.SM3Offset.value;
		indexes.forEach(index => {
			const objd = od[index];
			if (isInArray(objd.pdo_mappings, txpdo)) {
				esi += addEsiDevicePDO(objd, index, txpdo, memOffset);
				++memOffset;
			}
		});
	}
	
	//Add Mailbox DLL
	esi += `        <Mailbox DataLinkLayer="true">\n          <CoE ${getCoEString(form)}/>\n        </Mailbox>\n`;
	//Add DCs
	esi += getEsiDCsection(_dc);
	//Add EEPROM
	const configdata = hex_generator(form, true);
	esi +=`        <Eeprom>\n          <ByteSize>${parseInt(form.EEPROMsize.value)}</ByteSize>\n          <ConfigData>${configdata}</ConfigData>\n        </Eeprom>\n`;
	//Close all items
	esi +=`      </Device>\n    </Devices>\n  </Descriptions>\n</EtherCATInfo>`;

	return esi;	

	function addEsiDevicePDO(objd, index, pdo, memOffset) {
		var esi = '';
		const PdoName = pdo[0].toUpperCase();
		const SmNo = (pdo == txpdo) ? 3 : 2;
		const memoryOffset = indexToString(memOffset);
		esi += `        <${PdoName}xPdo Fixed="true" Mandatory="true" Sm="${SmNo}">\n          <Index>#x${memoryOffset}</Index>\n          <Name>${objd.name}</Name>`;
		var subindex = 0;
		switch (objd.otype) {
		case OTYPE.VAR: {
			const esiType = esiVariableTypeName(objd);
			const bitsize = esiDTbitsize(objd.dtype);
			esi += `\n          <Entry>\n            <Index>#x${index}</Index>\n            <SubIndex>#x${subindex.toString(16)}</SubIndex>\n            <BitLen>${bitsize}</BitLen>\n            <Name>${objd.name}</Name>\n            <DataType>${esiType}</DataType>\n          </Entry>`;
			esi += pdoBooleanPadding(objd);
			break;
		}
		case OTYPE.ARRAY: {
			const esiType = esiVariableTypeName(objd);
			const bitsize = esiDTbitsize(objd.dtype);
			subindex = 1;  // skip 'Max subindex'
			objd.items.slice(subindex).forEach(subitem => {
				esi += `\n          <Entry>\n            <Index>#x${index}</Index>\n            <SubIndex>#x${subindex.toString(16)}</SubIndex>\n            <BitLen>${bitsize}</BitLen>\n            <Name>${subitem.name}</Name>\n            <DataType>${esiType}</DataType>\n          </Entry>`;
				// TODO handle padding for array of booleans
				++subindex;
			});
			break;
		}
		case OTYPE.RECORD: {
			subindex = 1;  // skip 'Max subindex'
			objd.items.slice(subindex).forEach(subitem => {
				const esiType = esiVariableTypeName(subitem);
				const bitsize = esiDTbitsize(subitem.dtype);
				esi += `\n          <Entry>\n            <Index>#x${index}</Index>\n            <SubIndex>#x${subindex.toString(16)}</SubIndex>\n            <BitLen>${bitsize}</BitLen>\n            <Name>${subitem.name}</Name>\n            <DataType>${esiType}</DataType>\n          </Entry>`;
				esi += pdoBooleanPadding(subitem);
				++subindex;
			});
			break;
		}
		default: {
			alert(`Unexpected OTYPE ${objd.otype} for ${index} ${objd.name} in ESI ${PdoName}PDOs`);
			break;
		}}
		esi += `\n        </${PdoName}xPdo>\n`;
		
		return esi;

		function pdoBooleanPadding(item) {
			if (item.dtype == DTYPE.BOOLEAN) {
				return `\n          <Entry>\n            <Index>${0}</Index>\n            <SubIndex>${0}</SubIndex>\n            <BitLen>${7}</BitLen>\n          </Entry>`;
			}
			return ``;
		}
	}

	function toEsiHexValue(value) {
		if (!value) { 
			return 0;
		}
		if (value.startsWith && value.startsWith('0x')) {
			value = `#x${value.slice(2)}`;
		}
		return value;
	}

	function getPdoMappingFlags(item) {
		var flags = '';
		if (item.pdo_mappings) {
			if (item.pdo_mappings.length > 1) { 
				alert(`Object ${index} "${objd.name}" has multiple PDO mappings, that is not supported by this version of tool`
				+ `, only first ${pdoMappingFlag}XPDO will be used`);
			}
			const pdoMappingFlag = item.pdo_mappings[0].slice(0,1).toUpperCase();
			flags += `\n                  <PdoMapping>${pdoMappingFlag}</PdoMapping>`; 	
		}
		return flags;
	}

	function getEsiDCsection(dc) {
		if (!dc) {
			return '';
		}
		var dcSection = '        <Dc>';
		dc.forEach(opMode => {
			dcSection += `\n          <OpMode>\n            <Name>${opMode.Name}</Name>\n            <Desc>${opMode.Description}</Desc>\n            <AssignActivate>${opMode.AssignActivate}</AssignActivate>`;
			if (opMode.Sync0cycleTime && opMode.Sync0cycleTime != 0) { 
				dcSection += `\n            <CycleTimeSync0>${opMode.Sync0cycleTime}</CycleTimeSync0>`; 
			}
			if (opMode.Sync0shiftTime && opMode.Sync0shiftTime != 0) { 
				dcSection += `\n            <ShiftTimeSync0>${opMode.Sync0shiftTime}</ShiftTimeSync0>`; 
			}
			if (opMode.Sync1cycleTime && opMode.Sync1cycleTime != 0) { 
				dcSection += `\n            <CycleTimeSync1>${opMode.Sync1cycleTime}</CycleTimeSync1>`; 
			}
			if (opMode.Sync1shiftTime && opMode.Sync1shiftTime != 0) { 
				dcSection += `\n            <ShiftTimeSync1>${opMode.Sync1shiftTime}</ShiftTimeSync1>`; 
			}
			dcSection += `\n          </OpMode>`;
		});
		dcSection += `\n        </Dc>\n`;

		return dcSection;
	}

	//See Table 40 ETG2000
	function getCoEString(form)
	{
		var result = ""
	//	if(form.CoeDetails[0].checked) 
	//		result += 'SdoInfo="true" ';
	//	else
	//		result += 'SdoInfo="false" ';
		if(form.CoeDetails[1].checked) 
			result += 'SdoInfo="true" ';
		else
			result += 'SdoInfo="false" ';
		if(form.CoeDetails[2].checked) 
			result += 'PdoAssign="true" ';	
		else
			result += 'PdoAssign="false" ';
		if(form.CoeDetails[3].checked) 
			result += 'PdoConfig="true" ';
		else
			result += 'PdoConfig="false" ';
		if(form.CoeDetails[4].checked) 
			result += 'PdoUpload="true" ';
		else 
			result += 'PdoUpload="false" ';
		if(form.CoeDetails[5].checked) 
			result += 'CompleteAccess="true" ';
		else 
			result +='CompleteAccess="false" ';
		return result;										
	}

	function esiVariableTypeName(element) {
		let el_name = ESI_DT[element.dtype].name;
		if (element.dtype == DTYPE.VISIBLE_STRING) {
			return `${el_name}(${element.data.length})`;
		}
		return el_name;
	}	

	function esiDtName(element, index) {
		switch (element.otype) {
			case OTYPE.VAR:
				return esiVariableTypeName(element);
			case OTYPE.ARRAY:
			case OTYPE.RECORD:
				return `DT${index}`;
			default:
				alert(`Element 0x${index} has unexpected OTYPE ${element.otype}`);
				break;
		}
	}
	
	function esiBitsize(element) {
		switch (element.otype) {
			case OTYPE.VAR: {
				let bitsize = esiDTbitsize(element.dtype);
				if (element.dtype == DTYPE.VISIBLE_STRING) {
					return bitsize * element.data.length;
				}
				return bitsize;
			}
			case OTYPE.ARRAY: {
				const maxsubindex_bitsize = esiDTbitsize(DTYPE.UNSIGNED8);
				let bitsize = esiDTbitsize(element.dtype);
				let elements = element.items.length - 1; // skip max subindex
				return maxsubindex_bitsize * 2 + elements * bitsize;
			}
			case OTYPE.RECORD: {
				const maxsubindex_bitsize = esiDTbitsize(DTYPE.UNSIGNED8);
				let bitsize = maxsubindex_bitsize * 2;
				for (let subindex = 1; subindex < element.items.length; subindex++) {
					const subitem = element.items[subindex];
					bitsize += esiDTbitsize(subitem.dtype);
					if(subitem.dtype == DTYPE.BOOLEAN) {
						bitsize += booleanPaddingBitsize;
					}
				}
				return bitsize;
			}
			default:
				alert(`Element ${element} has unexpected OTYPE ${element.otype}`);
				break;
		}
	}	
}

// ####################### EEPROM generating ####################### //

function hex_generator(form, stringOnly=false)
{
	//WORD ADDRESS 0-7
	var record = getConfigDataBytes(form);
	if (stringOnly) { return getConfigDataString(record, form.ESC.value); }

	/** Takes form, returns config data: 
	 * first 16 bytes (8 words) with check sum */
	function getConfigDataBytes(form) {
		const recordLength = parseInt(form.EEPROMsize.value);
		var record = new Uint8Array(recordLength);
		record.fill(0xFF);
		//Start of EEPROM contents; A lot of information can be found in 5.4 of ETG1000.6
		const pdiControl = (form.ESC.value == 'LAN9252') ? 0x80 : 0x05;
		const spiMode = parseInt(form.SPImode.value);
		const reserved_0x05 = (form.ESC.value == 'AX58100') ? 0x001A : 0x00; // enable IO for SPI driver on AX58100:
		// Write 0x1A value (INT edge pulse length, 8 mA Control + IO 9:0 Drive Select) to 0x0A (Host Interface Extend Setting and Drive Strength
		
		//WORD ADDRESS 0-7
		writeEEPROMbyte_byteaddress(pdiControl, 0, record); //PDI control: SPI slave (mapped to register 0x0140)
		writeEEPROMbyte_byteaddress(0x06, 1, record); //ESC configuration: Distributed clocks Sync Out and Latch In enabled (mapped register 0x0141)
		writeEEPROMbyte_byteaddress(spiMode, 2, record); //SPI mode (mapped to register 0x0150)
		writeEEPROMbyte_byteaddress(0x44, 3, record); //SYNC /LATCH configuration (mapped to 0x0151). Make both Syncs output
		writeEEPROMword_wordaddress(0x0064, 2, record); //Syncsignal Pulselenght in 10ns units(mapped to 0x0982:0x0983)
		writeEEPROMword_wordaddress(0x00, 3, record); //Extended PDI configuration (none for SPI slave)(0x0152:0x0153)
		writeEEPROMword_wordaddress(0x00, 4, record); //Configured Station Alias (0x0012:0x0013)
		writeEEPROMword_wordaddress(reserved_0x05, 5, record); //Reserved, 0 (when not AX58100)
		writeEEPROMword_wordaddress(0x00, 6, record); //Reserved, 0
		writeEEPROMword_wordaddress(FindCRC(record, 14), 7, record); //CRC
		
		return record;
	}

	//WORD ADDRESS 8-15
	writeEEPROMDword_wordaddress(parseInt(form.VendorID.value),8,record);		//CoE 0x1018:01
	writeEEPROMDword_wordaddress(parseInt(form.ProductCode.value),10,record);	//CoE 0x1018:02
	writeEEPROMDword_wordaddress(parseInt(form.RevisionNumber.value),12,record);//CoE 0x1018:03
	writeEEPROMDword_wordaddress(parseInt(form.SerialNumber.value),14,record);	//CoE 0x1018:04
	//WORD ADDRESS 16-23
	writeEEPROMword_wordaddress(0,16,record); //Execution Delay Time; units?
	writeEEPROMword_wordaddress(0,17,record); //Port0 Delay Time; units?
	writeEEPROMword_wordaddress(0,18,record); //Port1 Delay Time; units?
	writeEEPROMword_wordaddress(0,19,record); //Reserved, zero
	writeEEPROMword_wordaddress(0,20,record); //Bootstrap Rx mailbox offset    //Bootstrap not supported
	writeEEPROMword_wordaddress(0,21,record); //Bootstrap Rx mailbox size
	writeEEPROMword_wordaddress(0,22,record); //Bootstrap Tx mailbox offset
	writeEEPROMword_wordaddress(0,23,record); //Bootstrap Tx mailbox size
	//WORD ADDRESS 24-...
	writeEEPROMword_wordaddress(parseInt(form.RxMailboxOffset.value),24,record); //Standard Rx mailbox offset   
	writeEEPROMword_wordaddress(parseInt(form.MailboxSize.value),25,record); //Standard Rx mailbox size
	writeEEPROMword_wordaddress(parseInt(form.TxMailboxOffset.value),26,record); //Standard Tx mailbox offset
	writeEEPROMword_wordaddress(parseInt(form.MailboxSize.value),27,record); //Standard Tx mailbox size
	writeEEPROMword_wordaddress(0x04,28,record); //CoE protocol, see Table18 in ETG1000.6
	for (var count = 29; count <= 61; count++) {		//fill reserved area with zeroes
		writeEEPROMword_wordaddress(0,count,record);
	}
	writeEEPROMword_wordaddress((Math.floor(parseInt(form.EEPROMsize.value)/128))-1,62,record); //EEPROM size
	writeEEPROMword_wordaddress(1,63,record); //Version
	////////////////////////////////////
	///    Vendor Specific Info	      //
	////////////////////////////////////
	
	//Strings
	var array_of_strings = [form.TextDeviceType.value, form.TextGroupType.value, form.ImageName.value, form.TextDeviceName.value];
	var offset = 0;
	offset = writeEEPROMstrings(record, 0x80, array_of_strings); //See ETG1000.6 Table20
	//General info
	offset = writeEEPROMgeneral_settings(form,offset,record); //See ETG1000.6 Table21
	//FMMU
	offset = writeFMMU(form,offset, record); //see Table 22 ETG1000.6
	//SyncManagers
	offset = writeSyncManagers(form, offset, record); //See Table 23 ETG1000.6
	//End of EEPROM contents
	const eepromSize = getForm().EEPROMsize.value;
	
	return record;
	
	/** See ETG1000.6 Table20 for Category string */
	function writeEEPROMstrings(record, offset, a_strings)
	{
		var number_of_strings = a_strings.length;
		var total_string_data_length = 0;
		var length_is_even;
		for(var strcounter = 0; strcounter < number_of_strings ; strcounter++)
		{
			total_string_data_length += a_strings[strcounter].length //add length of strings
		}
		total_string_data_length += number_of_strings; //for each string a byte is needed to indicate the length
		total_string_data_length += 1; //for byte to give 'number of strings'
		if(total_string_data_length %2) //if length is even (ends at word boundary)
			length_is_even = false;
		else
			length_is_even = true;
		writeEEPROMword_wordaddress(0x000A, offset/2, record); //Type: STRING
		writeEEPROMword_wordaddress(Math.ceil(total_string_data_length/2), (offset/2) + 1, record); //write length of complete package
		offset += 4; //2 words written
		writeEEPROMbyte_byteaddress(number_of_strings, offset++, record);
		for(var strcounter = 0; strcounter < number_of_strings ; strcounter++)
		{
			writeEEPROMbyte_byteaddress(a_strings[strcounter].length, offset++, record);
			for(var charcounter = 0 ; charcounter < a_strings[strcounter].length ; charcounter++)
			{
				writeEEPROMbyte_byteaddress(a_strings[strcounter].charCodeAt(charcounter), offset++, record);
			}	
		}
		if(length_is_even == false)
		{
			writeEEPROMbyte_byteaddress(0, offset++, record);
		}
		return offset;
	}
	/** See ETG1000.6 Table21 */
	function writeEEPROMgeneral_settings(form,offset,record)
	{
		const General_category = 0x1E; // value: 30d
		const categorysize = 0x10;
		//Clear memory region
		for(let wordcount = 0; wordcount < categorysize + 2; wordcount++) {
			writeEEPROMword_wordaddress(0, (offset/2) + wordcount, record);
		}
		//write code 30, 'General type'. See ETG1000.6, Table 19
		writeEEPROMword_wordaddress(General_category, offset/2, record);
		//write length of General Category data
		writeEEPROMword_wordaddress(categorysize, 1+(offset/2), record);
		offset +=4;
		writeEEPROMbyte_byteaddress(2,offset++,record);//index to string for Group Info
		writeEEPROMbyte_byteaddress(3,offset++,record);//index to string for Image Name
		writeEEPROMbyte_byteaddress(1,offset++,record);//index to string for Device Order Number
		writeEEPROMbyte_byteaddress(4,offset++,record);//index to string for Device Name Information
		offset++; //byte 4 is reserved
		writeEEPROMbyte_byteaddress(getCOEdetails(form),offset++,record);//CoE Details
		writeEEPROMbyte_byteaddress(0,offset++,record); //Enable FoE
		writeEEPROMbyte_byteaddress(0,offset++,record); //Enable EoE
		writeEEPROMbyte_byteaddress(0,offset++,record); //reserved
		writeEEPROMbyte_byteaddress(0,offset++,record); //reserved
		writeEEPROMbyte_byteaddress(0,offset++,record); //reserved
		writeEEPROMbyte_byteaddress(0,offset++,record); //flags (Bit0: Enable SafeOp, Bit1: Enable notLRW
		writeEEPROMword_wordaddress(0x0000, offset/2, record); //current consumption in mA
		offset += 2;
		writeEEPROMword_wordaddress(0x0000, offset/2, record); //2 pad bytes
		offset += 2;
		writeEEPROMword_wordaddress(getPhysicalPort(form), offset/2, record);
		offset += 2;
		offset += 14; //14 pad bytes
		return offset;
	}
	/** See ETG1000.6 Table 22 */
	function writeFMMU(form, offset, record)
	{
		const FMMU_category = 0x28 // 40d
		writeEEPROMword_wordaddress(FMMU_category,offset/2,record);
		offset += 2;
		const length = 2                                 //length = 2 word = 4bytes: 3 FMMU's + padding
														 //length = 1 word = 2bytes: 2 FMMU's.
		writeEEPROMword_wordaddress(length, offset/2, record);
		offset += 2;
		writeEEPROMbyte_byteaddress(1, offset++, record); //FMMU0 used for Outputs; see Table 22 ETG1000.6
		writeEEPROMbyte_byteaddress(2, offset++, record); //FMMU1 used for Inputs;  see Table 22 ETG1000.6
		writeEEPROMbyte_byteaddress(3, offset++, record); //FMMU2 used for Mailbox State
		writeEEPROMbyte_byteaddress(0, offset++, record); //padding, disable FMMU4 if exists
		
		return offset;
	}
	/** See Table 23 ETG1000.6 */
	function writeSyncManagers(form, offset, record)
	{
		const SyncManager_category = 0x29 // 41d
		writeEEPROMword_wordaddress(SyncManager_category, offset/2, record); //SyncManager
		offset += 2;
		writeEEPROMword_wordaddress(0x10, offset/2, record); //size of structure category
		offset += 2;
		//SM0
		writeEEPROMword_wordaddress(parseInt(form.RxMailboxOffset.value),offset/2, record); //Physical start address
		offset += 2;
		writeEEPROMword_wordaddress(parseInt(form.MailboxSize.value),offset/2, record); //Physical size
		offset += 2;
		writeEEPROMbyte_byteaddress(0x26,offset++, record); //Mode of operation
		writeEEPROMbyte_byteaddress(0,offset++, record); //don't care
		writeEEPROMbyte_byteaddress(1,offset++, record); //Enable Syncmanager; bit0: enable, bit 1: fixed content, bit 2: virtual SyncManager, bit 3: Op Only
		writeEEPROMbyte_byteaddress(1,offset++, record); //SyncManagerType; 0: not used, 1: Mbx out, 2: Mbx In, 3: PDO, 4: PDI
		//SM1
		writeEEPROMword_wordaddress(parseInt(form.TxMailboxOffset.value),offset/2, record); //Physical start address
		offset += 2;
		writeEEPROMword_wordaddress(parseInt(form.MailboxSize.value),offset/2, record); //Physical size
		offset += 2;
		writeEEPROMbyte_byteaddress(0x22,offset++, record); //Mode of operation
		writeEEPROMbyte_byteaddress(0,offset++, record); //don't care
		writeEEPROMbyte_byteaddress(1,offset++, record); //Enable Syncmanager; bit0: enable, bit 1: fixed content, bit 2: virtual SyncManager, bit 3: Op Only
		writeEEPROMbyte_byteaddress(2,offset++, record); //SyncManagerType; 0: not used, 1: Mbx out, 2: Mbx In, 3: PDO, 4: PDI
		//SM2
		writeEEPROMword_wordaddress(parseInt(form.SM2Offset.value),offset/2, record); //Physical start address
		offset += 2;
		writeEEPROMword_wordaddress(0,offset/2, record); //Physical size
		offset += 2;
		writeEEPROMbyte_byteaddress(0x24,offset++, record); //Mode of operation
		writeEEPROMbyte_byteaddress(0,offset++, record); //don't care
		writeEEPROMbyte_byteaddress(1,offset++, record); //Enable Syncmanager; bit0: enable, bit 1: fixed content, bit 2: virtual SyncManager, bit 3: Op Only
		writeEEPROMbyte_byteaddress(3,offset++, record); //SyncManagerType; 0: not used, 1: Mbx out, 2: Mbx In, 3: PDO, 4: PDI
		//SM3
		writeEEPROMword_wordaddress(parseInt(form.SM3Offset.value),offset/2, record); //Physical start address
		offset += 2;
		writeEEPROMword_wordaddress(0,offset/2, record); //Physical size
		offset += 2;
		writeEEPROMbyte_byteaddress(0x20,offset++, record); //Mode of operation
		writeEEPROMbyte_byteaddress(0,offset++, record); //don't care
		writeEEPROMbyte_byteaddress(1,offset++, record); //Enable Syncmanager; bit0: enable, bit 1: fixed content, bit 2: virtual SyncManager, bit 3: Op Only
		writeEEPROMbyte_byteaddress(4,offset++, record); //SyncManagerType; 0: not used, 1: Mbx out, 2: Mbx In, 3: PDO, 4: PDI
		return offset;
	}
	function getCOEdetails(form)
	{
		let coedetails = 0;
		if(form.CoeDetails[0].checked) coedetails |= 0x01; 	//Enable SDO
		if(form.CoeDetails[1].checked) coedetails |= 0x02;	//Enable SDO Info
		if(form.CoeDetails[2].checked) coedetails |= 0x04;	//Enable PDO Assign
		if(form.CoeDetails[3].checked) coedetails |= 0x08;	//Enable PDO Configuration
		if(form.CoeDetails[4].checked) coedetails |= 0x10;	//Enable Upload at startup
		if(form.CoeDetails[5].checked) coedetails |= 0x20;	//Enable SDO complete access
		return coedetails;
	}
	/** ETG1000.6 Table 21 */
	function getPhysicalPort(form)
	{
		let portinfo = 0;
		let physicals = [form.Port3Physical.value, form.Port2Physical.value, form.Port1Physical.value, form.Port0Physical.value];
		for (var physicalcounter = 0; physicalcounter < physicals.length ; physicalcounter++)
		{
			portinfo = (portinfo << 4); //shift previous result
			switch(physicals[physicalcounter])
			{
			case 'Y':
			case 'H':
				portinfo |= 0x01; //MII
				break;
			case 'K':
				portinfo |= 0x03; //EBUS
				break;
			default:
				portinfo |= 0; 	//No connection
			}
		}
		return portinfo;
	}

	/** computes crc value */
	function FindCRC(data,datalen) {
		var i,j;
		var c;
		var CRC=0xFF;
		var genPoly = 0x07;
		for (j=0; j<datalen; j++)
		{
			c = data[j];
			CRC ^= c;
			for(i = 0; i<8; i++)
				if(CRC & 0x80 )
				CRC = (CRC << 1) ^ genPoly;
				else
				CRC <<= 1;
			CRC &= 0xff;
		}
		return CRC;
	}
	
	function writeEEPROMbyte_byteaddress(byte, address, record)
	{
		record[address] = byte;
	}
	
	function writeEEPROMbyte_wordaddress(byte, address, record)
	{
		record[address*2] = byte;
	}
	
	function writeEEPROMword_wordaddress(word, address, record)
	{//little endian word storage!
		record[     address*2 ] = word&0xFF;
		record[1 + (address*2)] = (word>>8) & 0xFF;
	}
	
	function writeEEPROMDword_wordaddress(word, address, record)
	{//little endian word storage!
		record[     address*2 ] = word&0xFF;
		record[1 + (address*2)] = (word>>8) & 0xFF;
		record[2 + (address*2)] = (word>>16) & 0xFF;
		record[3 + (address*2)] = (word>>24) & 0xFF;
	}
	
	/** takes bytes array and count, returns ConfigData string */
	function getConfigDataString(record, esc) {
		const configdata_bytecount = (esc == 'AX58100') ? 14 : 7; // for AX58100 configdata reaches 0x0A byte
		var configdata = '';
		for (var bytecount = 0; bytecount < configdata_bytecount; bytecount++) {
			configdata += (record[bytecount] + 0x100).toString(16).slice(-2).toUpperCase();
		}
		return configdata;
	}
}

// ####################### ecat_options.h generation ####################### //

function ecat_options_generator(form, od, indexes)
{
	let ecat_options = '#ifndef __ECAT_OPTIONS_H__\n#define __ECAT_OPTIONS_H__\n\n#define USE_FOE          0\n#define USE_EOE          0\n\n';

	//Mailbox size
	ecat_options += '#define MBXSIZE          ' + parseInt(form.MailboxSize.value).toString()
				+ '\n#define MBXSIZEBOOT      ' + parseInt(form.MailboxSize.value).toString()
				+ '\n#define MBXBUFFERS       3\n\n';
	//Mailbox 0 Config
	ecat_options += `#define MBX0_sma         0x${indexToString(form.RxMailboxOffset.value)}`
				+ '\n#define MBX0_sml         MBXSIZE' 
				+ '\n#define MBX0_sme         MBX0_sma+MBX0_sml-1' 
				+ '\n#define MBX0_smc         0x26\n';
	//Mailbox 1 Config
	ecat_options += `#define MBX1_sma         MBX0_sma+MBX0_sml` //'0x${indexToString(form.TxMailboxOffset.value)}`;
				+ '\n#define MBX1_sml         MBXSIZE' 
				+ '\n#define MBX1_sme         MBX1_sma+MBX1_sml-1'
				+ '\n#define MBX1_smc         0x22\n\n';
	// Mailbox boot configuration
	ecat_options += `#define MBX0_sma_b       0x${indexToString(form.RxMailboxOffset.value)}`
				+ '\n#define MBX0_sml_b       MBXSIZEBOOT' 
				+ '\n#define MBX0_sme_b       MBX0_sma_b+MBX0_sml_b-1' 
				+ '\n#define MBX0_smc_b       0x26\n';
	ecat_options += `#define MBX1_sma_b       MBX0_sma_b+MBX0_sml_b` //'0x${indexToString(form.TxMailboxOffset.value)}`;
				+ '\n#define MBX1_sml_b       MBXSIZEBOOT' 
				+ '\n#define MBX1_sme_b       MBX1_sma_b+MBX1_sml_b-1'
				+ '\n#define MBX1_smc_b       0x22\n\n';
	//SyncManager2 Config
	ecat_options += `#define SM2_sma          0x${indexToString(form.SM2Offset.value)}`
				+ '\n#define SM2_smc          0x24' 
				+ '\n#define SM2_act          1\n';
	//SyncManager3 Config
	ecat_options += `#define SM3_sma          0x${indexToString(form.SM3Offset.value)}`
				+ '\n#define SM3_smc          0x20'
				+ '\n#define SM3_act          1\n\n';
	// Mappings config
	const MAX_MAPPINGS_SM2 = getMaxMappings(od, indexes, rxpdo);
	const MAX_MAPPINGS_SM3 = getMaxMappings(od, indexes, txpdo);
	ecat_options += `#define MAX_MAPPINGS_SM2 ${MAX_MAPPINGS_SM2}`
				+ `\n#define MAX_MAPPINGS_SM3 ${MAX_MAPPINGS_SM3}\n\n`
	// PDO buffer config
	ecat_options += '#define MAX_RXPDO_SIZE   512' 	// TODO calculate based on offset, size 
				+ '\n#define MAX_TXPDO_SIZE   512\n\n'
				+ '#endif /* __ECAT_OPTIONS_H__ */\n';

	return ecat_options;

	function getMaxMappings(od, indexes, pdoName) {
		let result = 0;

		indexes.forEach(index => {
			const objd = od[index];
			if(objd.pdo_mappings) {
				if(objd.items) {
					objd.items.slice(1).forEach(subitem => {
						objd.pdo_mappings.forEach(mapping => {
							if (mapping == pdoName) {
								++result;
								if (subitem.dtype == DTYPE.BOOLEAN) {
									++result; // boolean padding is mapping too
									// TODO handle array of booleans
								}
							}
						});
					});
				} else if(objd.pdo_mappings) {
					objd.pdo_mappings.forEach(mapping => {
						if (mapping == pdoName) { 
							++result;
							if (objd.dtype == DTYPE.BOOLEAN) {
								++result; // boolean padding is mapping too
							}
						}
					});
				};		
			};
		});
		return result;
	}
}

// ####################### utypes.h generation ####################### //

function utypes_generator(form, od, indexes) {
	var utypes = '#ifndef __UTYPES_H__\n#define __UTYPES_H__\n\n#include "cc.h"\n\n/* Object dictionary storage */\n\ntypedef struct\n{\n   /* Identity */\n'
	utypes += '\n   uint32_t serial;\n';
	
	var utypesInputs = '\n   /* Inputs */\n'; 
	var utypesOutputs = '\n   /* Outputs */\n';
	var hasInputs = isPdoWithVariables(od, indexes, txpdo); 
	var hasOutputs = isPdoWithVariables(od, indexes, rxpdo);

	indexes.forEach(index => {
		const objd = od[index];
		if (objd.pdo_mappings) {
			if(objd.pdo_mappings.length > 1) { alert(`${index} ${objd.name} Generating utypes.h for objects with multiple PDO mappings is not yet supported`); }
			
			const line = getUtypesDeclaration(objd);			
			
			if (objd.pdo_mappings[0] == txpdo)  {
				utypesInputs += line;
			} else {
				utypesOutputs += line;
			}
		}
	});
	
	if (hasInputs) { utypes += utypesInputs + '\n'; }
	if (hasOutputs) { utypes += utypesOutputs + '\n'; }
	
	var utypesOutputs = '\n   /* Parameters */\n';
	var anyParameters = false;
	indexes.forEach(index => {
		const objd = od[index];
		if (objd.isSDOitem) {
			utypesOutputs += getUtypesDeclaration(objd);
			anyParameters = true;
		}
	});
	if (anyParameters)  { 
		utypes += utypesOutputs;
	}

	utypes += '\n} _Objects;\n\nextern _Objects Obj;\n\n#endif /* __UTYPES_H__ */\n';
	
	return utypes;
	
	function getUtypesDeclaration(objd) {
		const varName = variableName(objd.name);
		switch (objd.otype) {
			case OTYPE.VAR: {
				const ctype = ESI_DT[objd.dtype].ctype;
				return `\n   ${ctype} ${varName};`
			}
			case OTYPE.ARRAY: {
				const ctype = ESI_DT[objd.dtype].ctype;
				return `\n   ${ctype} ${varName}[${objd.items.length - 1}];`
			}
			case OTYPE.RECORD: {
				var section = `\n   struct\n   {`;
				/* TODO test */
				objd.items.slice(1).forEach(subitem => {
					const subitemCType = ESI_DT[subitem.dtype].ctype;
					const subitemName = variableName(subitem.name);
					section += `\n      ${subitemCType} ${subitemName};`
				});
				section += `\n   } ${varName};`
				return section;
			}
			default: {
				alert(`Cannot generate utypes.h for object ${objd?.name} with has unexpected OTYPE ${objd?.otype}`);
				return '';
			}
		}
	}
}
