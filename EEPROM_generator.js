configdata = ""

// Object Type
const OTYPE = {
	VAR : 'VAR',
	ARRAY : 'ARRAY',
	RECORD: 'RECORD',
};
const DTYPE = {
	BOOLEAN : 'BOOLEAN',
	INTEGER8 : 'INTEGER8',
	INTEGER16 : 'INTEGER16',
	INTEGER32 : 'INTEGER32',
	UNSIGNED8 : 'UNSIGNED8',
	UNSIGNED16 : 'UNSIGNED16',
	UNSIGNED32 : 'UNSIGNED32',
	REAL32 : 'REAL32',
	VISIBLE_STRING : 'VISIBLE_STRING',
	OCTET_STRING : 'OCTET_STRING',
	UNICODE_STRING : 'UNICODE_STRING',
	INTEGER24 : 'INTEGER24',
	UNSIGNED24 : 'UNSIGNED24',
	INTEGER64 : 'INTEGER64',
	UNSIGNED64 : 'UNSIGNED64',
	REAL64 : 'REAL64',
	PDO_MAPPING : 'PDO_MAPPING',
};
const dtype_bitsize = {
	'BOOLEAN' : 8,
	'INTEGER8' : 8,
	'INTEGER16' : 16,
	'INTEGER32' : 32,
	'UNSIGNED8' : 8,
	'UNSIGNED16' : 16,
	'UNSIGNED32' : 32,
	'REAL32' : 32,
	'VISIBLE_STRING' : 8,
	// 'OCTET_STRING' : 8, /* TODO */
	// 'UNICODE_STRING' : 8, /* TODO */
	'INTEGER24' : 24,
	'UNSIGNED24' : 24,
	'INTEGER64' : 64,
	'UNSIGNED64' : 64,
	'REAL64' : 64,
	// 'PDO_MAPPING' : 8, /* TODO */
};
const ESItype = {
	// DTYPE to type symbol in ESI .xml
};
const ATYPE = {
	TXPDO : 'TXPDO',
	RXPDO : 'RXPDO',
};
const requided_SDOs = [  // these are required by minimal CiA 301 device
	'1000',
	'1008',
	'1009',
	'100A',
	'1018',
	'1C00'
];

function get_default_od() {

	const OD = {
		'1000': { otype: OTYPE.VAR, dtype: DTYPE.UNSIGNED32, name: 'Device Type', value: 0x1389 },
		'1008': { otype: OTYPE.VAR, dtype: DTYPE.VISIBLE_STRING, name: 'Device Name', data: '' },
		'1009': { otype: OTYPE.VAR, dtype: DTYPE.VISIBLE_STRING, name: 'Hardware Version', data: '' },
		'100A': { otype: OTYPE.VAR, dtype: DTYPE.VISIBLE_STRING, name: 'Software Version', data: '' },
		'1018': { otype: OTYPE.RECORD, name: 'Identity Object', items: [
			{ name: 'Max SubIndex' },
			{ name: 'Vendor ID', dtype: DTYPE.UNSIGNED32, value: 600 },
			{ name: 'Product Code', dtype: DTYPE.UNSIGNED32 },
			{ name: 'Revision Number', dtype: DTYPE.UNSIGNED32 },
			{ name: 'Serial Number', dtype: DTYPE.UNSIGNED32, data: '&Obj.serial' },
		]},
		'1C00': { otype: OTYPE.ARRAY, dtype: DTYPE.UNSIGNED8, name: 'Sync Manager Communication Type', items: [
			{ name: 'Max SubIndex' },
			{ name: 'Communications Type SM0', value: 1 },
			{ name: 'Communications Type SM1', value: 2 },
			{ name: 'Communications Type SM2', value: 3 },
			{ name: 'Communications Type SM3', value: 4 },
		]},
	};
	return OD;
}

function updatevalues(form)
{
	const od = get_default_od();
	populate_od(form, od);

	form.objectlist.value = objectlist_generator(form, od);
	form.ecat_options.value = ecat_options_generator(form, od);
	form.utypes.value = utypes_generator(form, od);
	form.HEX.value = hex_generator(form); //HEX generator needs to be run first, data from hex is used in esi
	form.ESI.value = esi_generator(form, od);
	return true;
}

function populate_od(form, od) {
	od['1008'].data = form.TextDeviceName.value;
	od['1009'].data = form.HWversion.value;
	od['100A'].data = form.SWversion.value;
	od['1018'].items[1].value = parseInt(form.VendorID.value);
	od['1018'].items[2].value = parseInt(form.ProductCode.value);
	od['1018'].items[3].value = parseInt(form.RevisionNumber.value);
	od['1018'].items[4].value = parseInt(form.SerialNumber.value);

	scan_indexes(od);
}

_usedIndexes = [];

function scan_indexes(od) {
	const index_min = 0x1000;
	const index_max = 0xFFFF;
	// clear
	_usedIndexes = [];
	// scan index address space for ones used  
	for (let i = index_min; i <= index_max; i++) {
		const index = i.toString(16).toUpperCase();
		const element = od[index];
		if (element) {
			_usedIndexes.push(index);
		}
	}
}

function get_used_indexes() {
	return _usedIndexes;
}

function subindex_padded(subindex) {
	// pad with 0 if single digit
	if (subindex > 9) {
		return `${subindex}`;
	}
	return `0${subindex}`;
}

function get_objdFlags(element) {
	var flags = "ATYPE_RO";
	/* TODO these can be set by PDO mappings */
	if (element.pdo_mappings) {
		element.pdo_mappings.forEach(mapping => {
			flags = `${flags} | ATYPE_${mapping}`;
		});
	}
	return flags;
}

function get_objdData(element) {
	el_data = 'NULL';

	if (element.data) {
		el_data = element.data;
		if (element.dtype == DTYPE.VISIBLE_STRING) {
			el_data = `"${element.data}"`;
		}
	}
	/* TODO el_data is assigned also for PDO mapped variables */
	return el_data;
}

function get_objdBitsize(element) {
	bitsize = dtype_bitsize[element.dtype];
	if (element.dtype == DTYPE.VISIBLE_STRING) {
		bitsize = bitsize * element.data.length;
	}
	return bitsize;
}

function objectlist_generator(form, od)
{
	var objectlist  = '#include "esc_coe.h"\n#include "utypes.h"\n#include <stddef.h>\n\n';
	const indexes = get_used_indexes();

	//Variable names
	indexes.forEach(index => {
		const element = od[index];
		objectlist += `\nstatic const char acName${index}[] = "${element.name}";`;
		switch (element.otype) {
			case OTYPE.VAR:
				break;
			case OTYPE.ARRAY:
			case OTYPE.RECORD: 
				for (let subindex = 0; subindex < element.items.length; subindex++) {
					const item = element.items[subindex];
					objectlist += `\nstatic const char acName${index}_${subindex_padded(subindex)}[] = "${item.name}";`;
				}
				break;
			default:
				alert("Unexpected object type in object dictionary: ", element)
				break;
		};
	});
	objectlist += '\n';
	//SDO objects declaration
	indexes.forEach(index => {
		const element = od[index];
		objectlist += `\nconst _objd SDO${index}[] =\n{`;
		
		switch (element.otype) {
			case OTYPE.VAR:
				el_value = '0';
				if (element.value && element.value != 0) {
					el_value = `0x${element.value.toString(16)}`;
				}
				const var_objd = `\n  {0x0, DTYPE_${element.dtype}, ${get_objdBitsize(element)}, ${get_objdFlags(element)}, acName${index}, ${el_value}, ${get_objdData(element)}},`;

				objectlist += var_objd;
				break;
			case OTYPE.ARRAY:
				arr_objd = `\n  {0x00, DTYPE_${DTYPE.UNSIGNED8}, ${8}, ATYPE_RO, acName${index}_00, ${element.items.length - 1}, NULL},`; // max subindex
				bitsize = dtype_bitsize[element.dtype]; /* TODO what if it is array of strings? */
				subindex = 0;
				element.items.forEach(item => {
					if (subindex > 0) { 	// skip max subindex, already done
						var subi = subindex_padded(subindex);
						arr_objd += `\n  {0x${subi}, DTYPE_${element.dtype}, ${bitsize}, ${get_objdFlags(item)}, acName${index}_${subi}, ${item.value || 0}, ${item.data || 'NULL'}},`;
					}
					subindex ++;
				});

				objectlist += arr_objd;
				break;
			case OTYPE.RECORD:
				rec_objd = `\n  {0x00, DTYPE_${DTYPE.UNSIGNED8}, ${8}, ATYPE_RO, acName${index}_00, ${element.items.length - 1}, NULL},`; // max subindex
				subindex = 0;
				element.items.forEach(item => {
					if (subindex > 0) { 	// skip max subindex, already done
						var subi = subindex_padded(subindex);
						el_bitlength = dtype_bitsize[item.dtype];
						rec_objd += `\n  {0x${subi}, DTYPE_${item.dtype}, ${el_bitlength}, ${get_objdFlags(item)}, acName${index}_${subi}, ${item.value || 0}, ${item.data || 'NULL'}},`;
					}
					subindex ++;
				});

				objectlist += rec_objd;
				break;
			default:
				alert("Unexpected object type om object dictionary");
				break;
		};
		objectlist += '\n};';
	})

	objectlist += '\n\nconst _objectlist SDOobjects[] =\n{';
	//SDO object dictionary declaration
	indexes.forEach(index => {
		const element = od[index];
		switch (element.otype) {
			case OTYPE.VAR:
			case OTYPE.ARRAY:
			case OTYPE.RECORD:
				let maxsubindex = 0;
				if (element.items) {
					maxsubindex = element.items.length - 1;
				}
				objectlist += `\n  {0x${index}, OTYPE_${element.otype}, ${maxsubindex}, ${element.pad1 || 0}, acName${index}, SDO${index}},`;
				break;
			default:
				alert("Unexpected object type om object dictionary")
				break;
		};
	})
	objectlist += '\n  {0xffff, 0xff, 0xff, 0xff, NULL, NULL}\n};\n';

	return objectlist;
}

//See ETG2000 for ESI format
function esi_generator(form, od)
{
	//VendorID
	var esi =`<?xml version="1.0" encoding="UTF-8"?>\n<EtherCATInfo>\n  <Vendor>\n    <Id>${parseInt(form.VendorID.value).toString()}</Id>\n`;
	//VendorName
	esi += `    <Name>${form.VendorName.value}</Name>\n  </Vendor>\n  <Descriptions>\n`;
	//Groups
	esi += `    <Groups>\n      <Group>\n        <Type>${form.TextGroupType.value}</Type>\n        <Name>${form.TextGroupName5.value}</Name>\n      </Group>\n    </Groups>\n    <Devices>\n`;
	//Physics  
	esi += `      <Device Physics="${form.Port0Physical.value + form.Port1Physical.value + form.Port2Physical.value || + form.Port3Physical.value}">\n        <Type ProductCode="#x${parseInt(form.ProductCode.value).toString(16)}" RevisionNo="#x${parseInt(form.RevisionNumber.value).toString(16)}">${form.TextDeviceType.value}</Type>\n`;
	//Add  Name info
	esi += `        <Name><![CDATA[${form.TextDeviceName.value}]]></Name>\n`;
	//Add in between
	esi += `        <GroupType>${form.TextGroupType.value}</GroupType>\n`;
	//Add profile
	esi += `        <Profile>\n          <ProfileNo>5001</ProfileNo>\n          <AddInfo>0</AddInfo>\n          <Dictionary>\n            <DataTypes>`;
/* TODO implement data types */
	const indexes = get_used_indexes();
	indexes.forEach(index => {
		const element = od[index];
		if (element.otype == OTYPE.RECORD || element.otype == OTYPE.ARRAY) {
			esi += `\n              <DataType>`;
			
			el_name = `DT${index}`;
			bitsize = 42;
			esi += `\n                <Name>${el_name}</Name>\n                <BitSize>${bitsize}</BitSize>`;
			subindex = 0;
			element.items.forEach(subitem => {
				esi += `\n                  <SubItem>SubItem ${subindex}</SubItem>`;
				subindex++;
			});
			esi += `\n              </DataType>`;
		}
	});
	esi += `\n            </DataTypes>\n            <Objects>`;
/* TODO implement object */
	indexes.forEach(index => {
		const element = od[index];
	});
	esi += `\n            </Objects>\n          </Dictionary>\n        </Profile>\n        <Fmmu>Outputs</Fmmu>\n        <Fmmu>Inputs</Fmmu>\n        <Fmmu>MBoxState</Fmmu>\n`;
	//Add Rxmailbox sizes
	esi += `        <Sm DefaultSize="${parseInt(form.MailboxSize.value).toString(10)}" StartAddress="#x${parseInt(form.RxMailboxOffset.value).toString(16)}" ControlByte="#x26" Enable="1">MBoxOut</Sm>\n`;
	//Add Txmailbox sizes
	esi += `        <Sm DefaultSize="${parseInt(form.MailboxSize.value).toString(10)}" StartAddress="#x${parseInt(form.TxMailboxOffset.value).toString(16)}" ControlByte="#x22" Enable="1">MBoxIn</Sm>\n`;
	//Add SM2
	esi += `        <Sm StartAddress="#x${parseInt(form.SM2Offset.value).toString(16)}" ControlByte="#x24" Enable="1">Outputs</Sm>\n`;
	//Add SM3
	esi += `        <Sm StartAddress="#x${parseInt(form.SM3Offset.value).toString(16)}" ControlByte="#x20" Enable="1">Inputs</Sm>\n`;
	//Add Mailbox DLL
	esi += `        <Mailbox DataLinkLayer="true">\n          <CoE ${getCoEString(form)}/>\n        </Mailbox>\n`;
	//Add DC
	esi += `        <Dc>\n          <OpMode>\n            <Name>DcOff</Name>\n            <Desc>DC unused</Desc>\n          <AssignActivate>#x0000</AssignActivate>\n          </OpMode>\n        </Dc>\n`;
	//Add EEPROM
	esi +=`        <Eeprom>\n          <ByteSize>${parseInt(form.EEPROMsize.value)}</ByteSize>\n          <ConfigData>${configdata}</ConfigData>\n        </Eeprom>\n`;
	//Close all items
	esi +=`      </Device>\n    </Devices>\n  </Descriptions>\n</EtherCATInfo>`;

	return esi;	
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
function hex_generator(form)
{
	var hex ="";
	configdata = "";
	var record = [0,0];
	record.length = parseInt(form.EEPROMsize.value);
	var bytes_per_rule = 32;
	for(var count = 0 ; count < record.length ; count++) //initialize array
		record[count] = 0xFF;
	//Start of EEPROM contents; A lot of information can be found in 5.4 of ETG1000.6
	//WORD ADDRESS 0-7
	writeEEPROMbyte_byteaddress(0x05,0,record); //PDI control: SPI slave (mapped to register 0x0140)
	writeEEPROMbyte_byteaddress(0x06,1,record); //ESC configuration: Distributed clocks Sync Out and Latch In enabled (mapped register 0x0141)
	writeEEPROMbyte_byteaddress(0x03,2,record); //SPI mode 3 (mapped to register 0x0150)
	writeEEPROMbyte_byteaddress(0x44,3,record); //SYNC /LATCH configuration (mapped to 0x0151). Make both Syncs output
	writeEEPROMword_wordaddress(0x0064,2,record);//Syncsignal Pulselenght in 10ns units(mapped to 0x0982:0x0983)
	writeEEPROMword_wordaddress(0x00,3,record); //Extended PDI configuration (none for SPI slave)(0x0152:0x0153)
	writeEEPROMword_wordaddress(0x00,4,record); //Configured Station Alias (0x0012:0x0013))
	writeEEPROMword_wordaddress(0x00,5,record); //Reserved, 0
	writeEEPROMword_wordaddress(0x00,6,record); //Reserved, 0
	writeEEPROMword_wordaddress(FindCRC(record,14),7,record); //CRC
	for (var bytecount = 0 ; bytecount < 7 ; bytecount++)
		configdata += (record[bytecount]+0x100).toString(16).slice(-2).toUpperCase();//store EEPROM data for future use in ESI file
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
	for(var count = 29; count <= 61; count++)		//fill reserved area with zeroes
		writeEEPROMword_wordaddress(0,count,record);
	writeEEPROMword_wordaddress((Math.floor(parseInt(form.EEPROMsize.value)/128))-1,62,record); //EEPROM size
	writeEEPROMword_wordaddress(1,63,record); //Version
	////////////////////////////////////
	///    Vendor Specific Info	      //
	////////////////////////////////////
	
	//Strings
	var array_of_strings = [form.TextDeviceType.value, form.TextGroupType.value, form.TextLine3.value, form.TextDeviceName.value];
	var offset = 0;
	offset = writeEEPROMstrings(record, 0x80, array_of_strings); //See ETG1000.6 Table20
	//General info
	offset = writeEEPROMgeneral_settings(form,offset,record); //See ETG1000.6 Table21
	//FMMU
	offset = writeFMMU(form,offset, record); //see Table 22 ETG1000.6
	//SyncManagers
	offset = writeSyncManagers(form, offset, record); //See Table 23 ETG1000.6
	//End of EEPROM contents
	for (var rulenumber = 0 ; rulenumber < (record.length/bytes_per_rule) ; rulenumber++)
	{
		hex += CreateiHexRule(bytes_per_rule, rulenumber, record.slice(rulenumber*bytes_per_rule,bytes_per_rule+(rulenumber*bytes_per_rule)));
	}
	//end of file marker
	hex += ':00000001FF';
	return hex.toUpperCase();
}

function writeSyncManagers(form, offset, record)
{//See Table 23 ETG1000.6
	writeEEPROMword_wordaddress(0x29,offset/2,record); //SyncManager
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

//see Table 22 ETG1000.6
function writeFMMU(form,offset, record)
{
	writeEEPROMword_wordaddress(0x28,offset/2,record);
	offset += 2;
	writeEEPROMword_wordaddress(1, offset/2, record); //length = 1 word = 2bytes: 2 FMMU's.
	offset += 2;
	writeEEPROMbyte_byteaddress(1, offset++, record); //FMMU0 used for Outputs; see Table 22 ETG1000.6
	writeEEPROMbyte_byteaddress(2, offset++, record); //FMMU1 used for Outputs; see Table 22 ETG1000.6
	return offset;
}
//See ETG1000.6 Table21
function writeEEPROMgeneral_settings(form,offset,record)
{
	categorysize = 0x10;
	//Clear memory region
	for(wordcount = 0; wordcount < categorysize+2 ; wordcount++)
		writeEEPROMword_wordaddress(0,(offset/2) + wordcount, record);
	//write code 30, 'General type'. See ETG1000.6, Table 19
	writeEEPROMword_wordaddress(30,offset/2,record);
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

// ETG1000.6 Table 21
function getPhysicalPort(form)
{
	portinfo = 0;
	physicals = [form.Port3Physical.value, form.Port2Physical.value, form.Port1Physical.value, form.Port0Physical.value];
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


function getCOEdetails(form)
{
	coedetails = 0;
	if(form.CoeDetails[0].checked) coedetails |= 0x01; 	//Enable SDO
	if(form.CoeDetails[1].checked) coedetails |= 0x02;	//Enable SDO Info
	if(form.CoeDetails[2].checked) coedetails |= 0x04;	//Enable PDO Assign
	if(form.CoeDetails[3].checked) coedetails |= 0x08;	//Enable PDO Configuration
	if(form.CoeDetails[4].checked) coedetails |= 0x10;	//Enable Upload at startup
	if(form.CoeDetails[5].checked) coedetails |= 0x20;	//Enable SDO complete access
	return coedetails;
}
//See ETG1000.6 Table20 for Category string
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
	writeEEPROMword_wordaddress(0x000A,offset/2,record); //Type: STRING
	writeEEPROMword_wordaddress(Math.ceil(total_string_data_length/2),(offset/2)+1, record); //write length of complete package
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

function CreateiHexRule(bytes_per_rule, rulenumber, record)
{
	var record_type_datarecord  = '00';
	var rule = ':'+ bytes_per_rule.toString(16).slice(-2) + generate_hex_address(rulenumber*bytes_per_rule) + record_type_datarecord;
	for(var byteposition = 0; byteposition < bytes_per_rule ; byteposition++)
	{
		var byte = record[byteposition].toString(16).slice(-2); // convert to hexadecimal, crop to last 2 digits
		if(byte.length < 2)
			byte = '0' + byte; //minimal field width  = 2 characters.
		rule += byte;
	}
	var checksum  = 0;
	for(var rule_pos = 0 ; rule_pos < (rule.length-1)/2 ; rule_pos++)
	{
		var byte = parseInt(rule.slice(1+(2*rule_pos), 3+(2*rule_pos)),16);
		checksum  += byte;
	}
	checksum %= 0x100; //leave last byte
	checksum = 0x100-checksum; //two's complement
    rule += checksum.toString(16).slice(-2) + '\n';
    return rule;
}

function generate_hex_address(number)
{
	//convert to hexadecimal string
	var output = number.toString(16);
	//take care that 4 characters are present
	while(output.length<4)
	{
		output ='0' + output;
	}
	//return 4 characters, prevents overflow
	return output.slice(-4);
}

function ecat_options_generator(form, od)
{
	ecat_options = '#ifndef __ECAT_OPTIONS_H__\n#define __ECAT_OPTIONS_H__\n\n#define USE_FOE          0\n#define USE_EOE          0\n\n';

	//Mailbox size
	ecat_options += '#define MBXSIZE          ' + parseInt(form.MailboxSize.value).toString()
				+ '\n#define MBXSIZEBOOT      ' + parseInt(form.MailboxSize.value).toString()
				+ '\n#define MBXBUFFERS       3\n\n';
	//Mailbox 0 Config
	ecat_options += '#define MBX0_sma         0x' + parseInt(form.RxMailboxOffset.value).toString(16)
				+ '\n#define MBX0_sml         MBXSIZE' 
				+ '\n#define MBX0_sme         MBX0_sma+MBX0_sml-1' 
				+ '\n#define MBX0_smc         0x26\n';
	//Mailbox 1 Config
	ecat_options += '#define MBX1_sma         MBX0_sma+MBX0_sml' //'0x' + parseInt(form.TxMailboxOffset.value).toString(16)
				+ '\n#define MBX1_sml         MBXSIZE' 
				+ '\n#define MBX1_sme         MBX1_sma+MBX1_sml-1'
				+ '\n#define MBX1_smc         0x22\n\n';
	// Mailbox boot configuration
	ecat_options += '#define MBX0_sma_b       0x' + parseInt(form.RxMailboxOffset.value).toString(16) 
				+ '\n#define MBX0_sml_b       MBXSIZEBOOT' 
				+ '\n#define MBX0_sme_b       MBX0_sma_b+MBX0_sml_b-1' 
				+ '\n#define MBX0_smc_b       0x26\n';
	ecat_options += '#define MBX1_sma_b       MBX0_sma_b+MBX0_sml_b' //'0x' + parseInt(form.TxMailboxOffset.value).toString(16)
				+ '\n#define MBX1_sml_b       MBXSIZEBOOT' 
				+ '\n#define MBX1_sme_b       MBX1_sma_b+MBX1_sml_b-1'
				+ '\n#define MBX1_smc_b       0x22\n\n';
	//SyncManager2 Config
	ecat_options += '#define SM2_sma          0x' + parseInt(form.SM2Offset.value).toString(16).toUpperCase()
				+ '\n#define SM2_smc          0x24' 
				+ '\n#define SM2_act          1\n';
	//SyncManager3 Config
	ecat_options += '#define SM3_sma          0x' + parseInt(form.SM3Offset.value).toString(16).toUpperCase()
				+ '\n#define SM3_smc          0x20'
				+ '\n#define SM3_act          1\n\n';
	// Mappings config
	const indexes = get_used_indexes();
	indexes.forEach(index => {
		const element = od[index];
		if(element.pdo_mappings) {};
	});
	ecat_options += '#define MAX_MAPPINGS_SM2 ' + 2  /* TODO iterate over indexes, count pdo_mappings to RXPDO */
				+ '\n#define MAX_MAPPINGS_SM3 ' + 10 /* TODO iterate over indexes, count pdo_mappings to TXPDO */ + '\n\n';
	// PDO buffer config
	ecat_options += '#define MAX_RXPDO_SIZE   512'
				+ '\n#define MAX_TXPDO_SIZE   512\n\n'
				+ '#endif /* __ECAT_OPTIONS_H__ */\n';

	return ecat_options;
}

function utypes_generator(form, od) {
	utypes = '#ifndef __UTYPES_H__\n#define __UTYPES_H__\n\n#include "cc.h"\n\n/* Object dictionary storage */\n\ntypedef struct\n{\n   /* Identity */\n'
	utypes += '\n   uint32_t serial;\n\n';
	/* TODO implement OD type declaration */
	utypes += '\n} _Objects;\n\nextern _Objects Obj;\n\n#endif /* __UTYPES_H__ */\n';

	return utypes;
}

function FindCRC(data,datalen)         // computes crc value
{
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

window.onload = (event) => {
	// for convinience during tool development, trigger codegen on page refresh
	const form = document.getElementById('SlaveForm');
	updatevalues(form);
}