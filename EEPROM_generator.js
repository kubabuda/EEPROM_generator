configdata = ""

function updatevalues(form)
{
	form.objlist.value = objlist_generator(form);
	form.HEX.value = hex_generator(form); //HEX generator needs to be run first, data from hex is used in esi
	form.ESI.value = esi_generator(form);
	form.esc_h.value = esc_h_generator(form);
	return true;
}

function objlist_generator(form)
{
	//Device Name
	var objlist='/** Definiton of Device Name */\nchar ac1008_00[]="' + form.TextLine4.value +'";\n';
	//Hardware Version, Software Version
	objlist += '/** Definition of Hardware version*/\nchar ac1009_00[]="' + form.HWversion.value+'";\n/** Definition of Software version*/\nchar ac100A_00[]="' + form.SWversion.value + '";\n';
	//Fixed stuff; Filling in data
	objlist += '/** Service Data Object 1000: Device Type */\nconst _objd SDO1000[]=\n{{0x00,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1000[0],0x00000000}};\n/** Service Data Object 1008: Device Name */\nconst _objd SDO1008[]=\n{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac1008_00)<<3,ATYPE_R,&acName1008[0],0,&ac1008_00[0]}};\n/** Service Data Object 1009: Hardware Version */\nconst _objd SDO1009[]=\n{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac1009_00)<<3,ATYPE_R,&acName1009[0],0,&ac1009_00[0]}};\n/** Service Data Object 100A: Software Version */\nconst _objd SDO100A[]=\n{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac100A_00)<<3,ATYPE_R,&acName100A[0],0,&ac100A_00[0]}};\n';	
	//Identity Object
	objlist += "const _objd SDO1018[]=                                              //See ETG.1000.6 'Identity Object'\n {{0x00,DTYPE_UNSIGNED8,8,ATYPE_R,&acNameNOE[0],0x04},               //Number of Entries\n  {0x01,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_01[0]," + form.VendorID.value + "},  //Vendor ID\n  {0x02,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_02[0]," + form.ProductCode.value + " },  //Product Code\n  {0x03,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_03[0]," + form.RevisionNumber.value + "},  //Revision Number\n  {0x04,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_04[0]," + form.SerialNumber.value + "}   //Serial Number\n};\n"
	return objlist;
}

//See ETG2000 for ESI format
function esi_generator(form)
{
//VendorID
	var esi ='<?xml version="1.0"?>\n<EtherCATInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="EtherCATInfo.xsd" Version="1.2">\n	<Vendor>\n		<Id>' + parseInt(form.VendorID.value).toString() + '</Id>\n';
//VendorName
	esi += '		<Name>'+ form.VendorName.value + '</Name>\n	</Vendor>\n';
//Groups
	esi += '		<Groups>\n			<Group>\n				<Type>SMFKPROTO</Type>\n				<Name>' + form.TextLine2.value + '</Name>\n			</Group>\n		</Groups>\n		<Devices>\n';
//Physics	
	esi += '			<Device Physics="'+ form.Port0Physical.value + form.Port1Physical.value + form.Port2Physical.value + form.Port3Physical.value +'">\n				<Type ProductCode="#x'+ parseInt(form.ProductCode.value).toString(16) + '" RevisionNo="#x' + parseInt(form.RevisionNumber.value).toString(16) + '">'+ form.TextLine1.value + '</Type>\n';
//Add  Name info
	esi += '				<Name><![CDATA['+ form.TextLine4.value +']]></Name>\n';
//Add in between
	esi += '				<GroupType>SMFKPROTO</GroupType>\n				<Fmmu>Outputs</Fmmu>\n				<Fmmu>Inputs</Fmmu>\n';
//Add Rxmailbox sizes
	esi += '				<Sm DefaultSize="' + parseInt(form.MailboxSize.value).toString(10) +'" StartAddress="#x' + parseInt(form.RxMailboxOffset.value).toString(16) +'" ControlByte="#x26" Enable="1">MBoxOut</Sm>\n';
//Add Txmailbox sizes
	esi += '				<Sm DefaultSize="' + parseInt(form.MailboxSize.value).toString(10) +'" StartAddress="#x' + parseInt(form.TxMailboxOffset.value).toString(16) +'" ControlByte="#x22" Enable="1">MBoxIn</Sm>\n';
//Add SM2
	esi += '				<Sm StartAddress="#x' + parseInt(form.SM2Offset.value).toString(16) +'" ControlByte="#x24" Enable="1">Outputs</Sm>\n';
//Add SM3
	esi += '				<Sm StartAddress="#x' + parseInt(form.SM3Offset.value).toString(16) +'" ControlByte="#x20" Enable="1">Inputs</Sm>\n';	
//Add Mailbox DLL
	esi += '				<Mailbox DataLinkLayer="true">\n					<CoE '+ getCoEString(form) + '  />\n				</Mailbox>\n';
//Add DC
	esi += '				<Dc>\n					<OpMode>\n						<Name>DcOff</Name>\n						<Desc>DC unused</Desc>\n					<AssignActivate>#x0000</AssignActivate>\n					</OpMode>\n				</Dc>\n';
//Add EEPROM
	esi +='				<Eeprom>\n					<ByteSize>' + parseInt(form.EEPROMsize.value) + '</ByteSize>\n					<ConfigData>'+ configdata +'</ConfigData>\n				</Eeprom>\n';
//Close all items
	esi +='			</Device>\n		</Devices>\n	</Descriptions>\n</EtherCATInfo>';
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
		result += 'Complete access="true" ';
	else 
		result +='Complete access="false" ';
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
	var array_of_strings = [form.TextLine1.value, form.TextLine2.value, form.TextLine3.value, form.TextLine4.value];
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

function esc_h_generator(form)
{
	//Mailbox size
	esc_h  = '#define MBXSIZE                 		0x' + parseInt(form.MailboxSize.value).toString(16) + '\n#define MBXBUFFERS              		3\n';
	//Mailbox 0 Config
	esc_h += '\n#define MBX0_sma                		0x' + parseInt(form.RxMailboxOffset.value).toString(16) +'\n#define MBX0_sml                		MBXSIZE\n#define MBX0_sme                		MBX0_sma+MBX0_sml-1\n#define MBX0_smc                		0x26\n';
	//Mailbox 1 Config
	esc_h += '#define MBX1_sma                		0x' + parseInt(form.TxMailboxOffset.value).toString(16) +'\n#define MBX1_sml                		MBXSIZE\n#define MBX1_sme                		MBX1_sma+MBX1_sml-1\n#define MBX1_smc                		0x22\n';
	//SyncManager2 Config
	esc_h += '\n#define SM2_sma                 		0x' + parseInt(form.SM2Offset.value).toString(16) +'\n#define SM2_smc                 		0x24\n#define SM2_act					0x01\n';
	//SyncManager3 Config
	esc_h += '#define SM3_sma                 		0x' + parseInt(form.SM3Offset.value).toString(16) +'\n#define SM3_smc                 		0x20\n#define SM3_act					0x01\n';
	return esc_h;
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