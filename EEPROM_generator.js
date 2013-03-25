function updatevalues(form)
{
	form.objlist.value = objlist_generator(form);
	form.ESI.value = esi_generator(form);
	form.HEX.value = hex_generator(form);
	return true;
}

function objlist_generator(form)
{
	//Device Name
	var objlist='/** Definiton of Device Name */\nchar ac1008_00[]="' + form.DeviceName.value +"\n";
	//Hardware Version, Software Version
	objlist += '/** Definition of Hardware version*/\nchar ac1009_00[]="' + form.HWversion.value+'";\n/** Definition of Software version*/\nchar ac100A_00[]="' + form.SWversion.value + '";\n"';
	//Fixed stuff; Filling in data
	objlist += '/** Service Data Object 1000: Device Type */\nconst _objd SDO1000[]=\n{{0x00,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1000[0],0x00000000}};\n/** Service Data Object 1008: Device Name */\nconst _objd SDO1008[]=\n{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac1008_00)<<3,ATYPE_R,&acName1008[0],0,&ac1008_00[0]}};\n/** Service Data Object 1009: Hardware Version */\nconst _objd SDO1009[]=\n{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac1009_00)<<3,ATYPE_R,&acName1009[0],0,&ac1009_00[0]}};\n/** Service Data Object 100A: Software Version */\nconst _objd SDO100A[]=\n{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac100A_00)<<3,ATYPE_R,&acName100A[0],0,&ac100A_00[0]}};\n';	
	//Identity Object
	objlist += "const _objd SDO1018[]=                                              //See ETG.1000.6 'Identity Object'\n {{0x00,DTYPE_UNSIGNED8,8,ATYPE_R,&acNameNOE[0],0x04},               //Number of Entries\n  {0x01,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_01[0],0x" + form.VendorID.value + "},  //Vendor ID\n  {0x02,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_02[0],0x" + form.ProductCode.value + " },  //Product Code\n  {0x03,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_03[0]," + form.RevisionNumber.value + "},  //Revision Number\n  {0x04,DTYPE_UNSIGNED32,32,ATYPE_R,&acName1018_04[0],0x" + form.SerialNumber.value + "}   //Serial Number};\n"
	return objlist;
}

function esi_generator(form)
{
//VendorID
	var esi ='<?xml version="1.0"?>\n<EtherCATInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="EtherCATInfo.xsd" Version="1.2">\n	<Vendor>\n		<Id>' + parseInt(form.VendorID.value,16).toString() + '</Id>\n';
//VendorName
	esi += '		<Name>'+ form.VendorName.value + '</Name>\n	</Vendor>\n';
//Groups
	esi += '		<Groups>\n			<Group>\n				<Type>SMFKPROTO</Type>\n				<Name>SOES</Name>\n			</Group>\n		</Groups>\n		<Devices>\n			<Device Physics="YY">\n				<Type ProductCode="#x'+ form.ProductCode.value + '" RevisionNo="#x' + form.RevisionNumber.value + '">'+ form.DeviceName.value + '</Type>\n';
//Add  Name info
	esi += '				<Name><![CDATA['+ form.DeviceName.value +']]></Name>\n';
	return esi;	
}

function hex_generator(form)
{
	var hex ="";
	var rule_start=':20';
	var record_type_datarecord  = '00';
	var address = 0;//format to 4 hex digits
	var maxAddress = parseInt(form.EEPROMsize.value, 10);
	for (address  = 0 ; address < maxAddress ; address++)
	{
		if(address % 32 == 0)
		{
			//create start of new rule
			hex += '\n' + rule_start + generate_hex_address(address) + record_type_datarecord; 
		}
		hex += 'FF';
	}
	//end of file marker
	hex += '\n:00000001FF'
	//remove starting newline
	hex = hex.slice(1,hex.length);
	return hex;
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

