const automaticCodegen = true; 		// code is regenerated on every form change. 
									// no need to remember to generate before copying or downloading
									// app is noticeably slower

// ####################### Constants, lookup tables ####################### //
var configdata = ""

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
	/* TODO implement missing less common types */
	// OCTET_STRING : 'OCTET_STRING',
	// UNICODE_STRING : 'UNICODE_STRING',
	// INTEGER24 : 'INTEGER24',
	// UNSIGNED24 : 'UNSIGNED24',
	// INTEGER64 : 'INTEGER64',
	// UNSIGNED64 : 'UNSIGNED64',
	// REAL64 : 'REAL64',
	// PDO_MAPPING : 'PDO_MAPPING',
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
};
const ESI_DT = {
	'BOOLEAN': { name: 'BOOL', bitsize: 1, ctype: 'uint8_t' },
	'INTEGER8': { name: 'SINT', bitsize: 8, ctype: 'int8_t' },
	'INTEGER16': { name: 'INT', bitsize: 16, ctype: 'int16_t' },
	'INTEGER32': { name: 'DINT', bitsize: 32, ctype: 'int32_t' },
	'UNSIGNED8': { name: 'USINT', bitsize: 8, ctype: 'uint8_t' },
	'UNSIGNED16': { name: 'UINT', bitsize: 16, ctype: 'uint16_t' },
	'UNSIGNED32': { name: 'UDINT', bitsize: 32, ctype: 'uint32_t' },
	'REAL32': { name: 'REAL', bitsize: 32, ctype: 'double' }, // TODO check C type name
	'VISIBLE_STRING': { name: 'STRING', bitsize: 8, ctype: 'char *' }, // TODO check C type name
};

var sdo = 'sdo';
var txpdo = 'txpdo';
var rxpdo = 'rxpdo';

const SDO_category = {  // these are required by minimal CiA 301 device /* TODO check if all */
	'1000': 'm',
	// '1008': true,
	'1009': 'o',
	// '100A': true,
	// '1018': true,
	// '1C00': true,
};

function getMandatoryObjects() {
	// OD index is hexadecimal value without '0x' prefix
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

// ####################### Object Dictionary building ####################### //

const _odSections = {
	sdo : {},
	txpdo : {}, // addding PDO requires matching SDO in Sync Manager, and PDO mapping
	rxpdo : {}, // this will be done when stitching sections during code generation - TODO
};

function getObjDictSection(odSectionName) {
	return _odSections[odSectionName];
}

function objectExists(odSectionName, index) {
	var odSection = getObjDictSection(odSectionName);
	return index && odSection[index];
}

function checkObjectType(expected, objd) {
	if (objd.otype != expected) {
		var msg = `Object ${objd.name} was expected to be OTYPE ${expected} but is ${objd.otype}`;
		alert(msg);
		throw new Exception(msg);
	}
}

function addObject(od, objd, index) {
	if (od[index]) {
		alert(`Object ${objd.name} duplicates 0x${index}: ${od[index].name} !`);
	}
	od[index] = objd;
}

function removeObject(od, index) {
	if (index) {
		if (od[index]) {
			delete od[index];
		} else {
			alert(`Cannot remove object 0x${index}: it does not exist`);
		}
	}
}

function variableName(objectName) {
	const charsToReplace = [ ' ', '.', ',', ';', ':', '/' ];
	const charsToRemove = [ '+', '-', '*', '=', '!', '@' ];

	var variableName = objectName;
	charsToReplace.forEach(c => {
		variableName = variableName.replaceAll(c, '_');
	});
	charsToRemove.forEach(c => {
		variableName = variableName.replaceAll(c, '');
	});
	return variableName;
}

function addSDOitems(od) {
	const sdoSection = getObjDictSection(sdo);
	const indexes = getUsedIndexes(sdoSection);

	indexes.forEach(index => {
		const item = sdoSection[index];
		addObject(od, item, index);
	});
}

function addRXPDOitems(od) {
	const rxpdoSection = getObjDictSection(rxpdo);
	const form = getForm();
	const pdo = {
		mappingValue : rxpdo,
		SMassignmentIndex : '1C12',
		smOffset : parseInt(form.SM2Offset.value), // usually 0x1400
	};
	addPdoObjectsSection(od, rxpdoSection, pdo);
}

function addTXPDOitems(od) {
	const txpdoSection = getObjDictSection(txpdo);
	const form = getForm();
	const pdo = {
		mappingValue : txpdo,
		SMassignmentIndex : '1C13',
		smOffset : parseInt(form.SM3Offset.value), // usually 0x1A00
	};
	addPdoObjectsSection(od, txpdoSection, pdo);
}

function addPdoObjectsSection(od, odSection, pdo){
	var currentSMoffsetValue = pdo.smOffset;
	const indexes = getUsedIndexes(odSection);

	if (indexes.length) {
		ensurePDOAssignmentExists(od, pdo.SMassignmentIndex);
	}

	indexes.forEach(index => {
		const objd = odSection[index];
		const currentOffset = indexToString(currentSMoffsetValue)
		
		const pdoMappingObj = { otype: OTYPE.RECORD, name: objd.name, items: [
			{ name: 'Max SubIndex' },
		]};
		const pdoAssignments = [];
		
		switch (objd.otype) {
		case  OTYPE.VAR: {
			// create PDO mappings and SM assignments
			pdoMappingObj.items.push({ name: objd.name, dtype: DTYPE.UNSIGNED32, value: getPdoMappingValue(index, 0, objd.dtype) });
			// create mapping
			pdoAssignments.push({ name: "PDO Mapping", value: `0x${currentOffset}` });
			// link to OD variable declared on OD struct
			objd.data = `&Obj.${variableName(objd.name)}`;
			if (!objd.pdo_mappings) {
				objd.pdo_mappings = [];
			} // mark object as PDO mapped
			objd.pdo_mappings.push(pdo.mappingValue);
			break;
		} 
		case OTYPE.ARRAY: {
			objd.items.foreach(subitem => {
				// TODO add mapping for every item
				// TODO assign mapping for every item
			});
			break;
		}
		case OTYPE.RECORD: {
			objd.items.foreach(subitem => {
				// TODO add mapping for every item
				// TODO assign mapping for every item
			});
			break;
		}
		default: {
			alert(`${pdoMappingValue} object ${index} ${objd.name} has unexpected object type ${objd.otype}!`);
			break;
		}}

		addObject(od, pdoMappingObj, currentOffset);

		pdoAssignments.forEach(pdoAssignment => {
			od[pdo.SMassignmentIndex].items.push(pdoAssignment);
		});

		addObject(od, objd, index);

		++currentSMoffsetValue;
	});

	
	function ensurePDOAssignmentExists(od, index) {	
		if (!od[index]) {
			od[index] = { otype: OTYPE.ARRAY, dtype: DTYPE.UNSIGNED16, name: `Sync Manager ${index[3]} PDO Assignment`, items: [
				{ name: 'Max SubIndex' },
			]};
		}
	}
	
	function getPdoMappingValue(index, subindex, dtype) {
		function toByte(value) {
			var result = value.toString(16).slice(0, 2);
			while (result.length < 2) {
				result = `0${result}`;
			}
			return result;
		}
		var bitsize = esiDTbitsize(dtype);
		
		return `0x${index}${toByte(subindex)}${toByte(bitsize)}`;
	}	
}

// ####################### Building Object Dictionary model ####################### //

function populateMandatoryObjectValues(form, od) {
	// populate mandatory object values
	od['1008'].data = form.TextDeviceName.value;
	od['1009'].data = form.HWversion.value;
	od['100A'].data = form.SWversion.value;
	od['1018'].items[1].value = parseInt(form.VendorID.value);
	od['1018'].items[2].value = parseInt(form.ProductCode.value);
	od['1018'].items[3].value = parseInt(form.RevisionNumber.value);
	od['1018'].items[4].value = parseInt(form.SerialNumber.value);
}

function buildObjectDictionary(form) {
	const od = getMandatoryObjects();
	populateMandatoryObjectValues(form, od);
	// populate custom objects
	addSDOitems(od);
	addTXPDOitems(od);
	addRXPDOitems(od);

	return od;
}

function getFirstFreeIndex(odSectionName) {
	var addressRangeStart = {
		"sdo": 0x2000,
		"txpdo": 0x6000,
		"rxpdo": 0x7000,
	}
	var result = addressRangeStart[odSectionName];
	var odSection = getObjDictSection(odSectionName);
	while (odSection[indexToString(result)]) {
		result++;
	}

	return indexToString(result);
}

function indexToString(index) {
	var indexValue = parseInt(index);
	
	return indexValue.toString(16).toUpperCase();
}

function getUsedIndexes(od) {
	const index_min = 0x1000;
	const index_max = 0xFFFF;
	const usedIndexes = [];
	// scan index address space for ones used  
	for (let i = index_min; i <= index_max; i++) {
		const index = indexToString(i);
		const element = od[index];
		if (element) {
			usedIndexes.push(index);
		}
	}
	return usedIndexes;
}

// ####################### File accessing ####################### //

// saves file in local filesystem - downloads from browser
function downloadFile(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function getForm() {
	return document.getElementById("SlaveForm");
}

function readFile(e) {
	var file = e.target.files[0];
	if (!file) return;
	var reader = new FileReader();
	reader.onload = function(e) {
		restoreBackup(e.target.result);
  	}
	reader.readAsText(file);
}

// ####################### Backup serialization + deserialization ####################### //

function isValidBackup(backup) {
	if (!backup || !backup.form || !backup.od ) {
		if (!confirm('Backup is incomplete or invalid, proceed anyway?')) {
			return false;
		}
	}
	return true;
}

function prepareBackupObject() {
	const form = getForm();
	const formValues = {};
	Object.entries(form).forEach(formEntry => {
		const formControl = formEntry[1]; // entry[0] is form control order number
		if(formControl.value) {
			formValues[formControl.name] = formControl.value;
		};
	});

	const backup = {
		form: formValues,
		od: _odSections,
	};

	return backup;
}

function loadBackup(backupObject) {
	if (backupObject.od) {
		_odSections.sdo = backupObject.od.sdo;
		_odSections.txpdo = backupObject.od.txpdo;
		_odSections.rxpdo = backupObject.od.rxpdo;
	}
		
	var form = getForm();
	Object.entries(form).forEach(formEntry => {
		const formControl = formEntry[1]; // entry[0] is index
		const formControlValue = backupObject.form[formControl.name];
		if(formControlValue) {
			formControl.value = formControlValue;
		};
	});
}

function prepareBackupFileContent() {
	var backupObject = prepareBackupObject();
	var backupFileContent = JSON.stringify(backupObject, null, 2); // pretty print
	return backupFileContent;
}

// ####################### Backup using JSON file from filesystem ####################### //

// Localstorage limit is usually 5MB, super large object dictionaries on older browsers might be problematic

function downloadBackupFile() {
	const backupFileContent = prepareBackupFileContent(); // pretty print
	downloadFile(backupFileContent, fileName = 'esi.json', contentType = 'text/json');
}

function restoreBackup(fileContent) {
	var backup = JSON.parse(fileContent);
	if (isValidBackup(backup)) {
		loadBackup(backup);
		reloadOD_Sections();
	}
}

// ####################### Backup using browser localstorage ####################### //

function saveLocalBackup() {
	localStorage.etherCATeepromGeneratorBackup = prepareBackupFileContent();
}

function tryRestoreLocalBackup() {
	if (localStorage.etherCATeepromGeneratorBackup) {
		restoreBackup(localStorage.etherCATeepromGeneratorBackup);
	}
}

function resetLocalBackup() {
	if (localStorage.ethetruerCATeepromGeneratorBackup) {
		delete localStorage.etherCATeepromGeneratorBackup;
	}
}

// ####################### Button handlers ####################### //


function processForm(form)
{
	const od = buildObjectDictionary(form);
	const indexes = getUsedIndexes(od);

	form.objectlist.value = objectlist_generator(form, od, indexes);
	form.ecat_options.value = ecat_options_generator(form, od, indexes);
	form.utypes.value = utypes_generator(form, od, indexes);
	form.HEX.value = hex_generator(form); //HEX generator needs to be run first, data from hex is used in esi
	form.ESI.value = esi_generator(form, od, indexes);

	// saveLocalBackup();

	return true;
}

function onGenerateDownloadClick()
{
	const form = getForm();
	processForm(form);
	downloadFile(form.ESI.value, fileName = 'esi.xml', contentType = 'text/html');
	// TODO this probably is wrong MIME type, check another one: https://www.sitepoint.com/mime-types-complete-list/
	downloadFile(form.HEX.value, fileName = 'eeprom.hex', contentType = 'application/octet-stream');
	downloadFile(form.ecat_options.value, fileName = 'ecat_options.h', contentType = 'text/plain');
	downloadFile(form.objectlist.value, fileName = 'objectlist.c', contentType = 'text/plain');
	downloadFile(form.utypes.value, fileName = 'utypes.h', contentType = 'text/plain');
}

function onGenerateClick() {
	processForm(getForm());
}

function onSaveClick() {
	downloadBackupFile();
	saveLocalBackup();
}

document.onkeydown = function(e) {
	if (e.ctrlKey && e.keyCode === 83) {
		event.preventDefault();
		onSaveClick();
        return false;
    }
};

function onRestoreClick() {
	// trigger file input dialog window
	document.getElementById('restoreFileInput').click();
}

function onResetClick() {
	if (confirm("Are you sure you want to reset project to default values?")){
		resetLocalBackup();
		location.reload(true);
	}
}

// ####################### Objectlist.c generating ####################### //

function subindex_padded(subindex) {
	// pad with 0 if single digit
	if (subindex > 9) {
		return `${subindex}`;
	}
	return `0${subindex}`;
}

function get_objdFlags(element) {
	let flags = "ATYPE_RO";
	if (element.pdo_mappings) {
		element.pdo_mappings .forEach(mapping => {
			flags = `${flags} | ATYPE_${mapping.toUpperCase()}`;
		});
	}
	return flags;
}

function get_objdData(element) {
	let el_data = 'NULL';

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
	let bitsize = dtype_bitsize[element.dtype];
	if (element.dtype == DTYPE.VISIBLE_STRING) {
		bitsize = bitsize * element.data.length;
	}
	return bitsize;
}

function objectlist_generator(form, od, indexes)
{
	var objectlist  = '#include "esc_coe.h"\n#include "utypes.h"\n#include <stddef.h>\n\n';

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
			case OTYPE.VAR: {
				let el_value = '0';
				if (element.value && element.value != 0) {
					el_value = `0x${element.value.toString(16)}`;
				}
				const var_objd = `\n  {0x0, DTYPE_${element.dtype}, ${get_objdBitsize(element)}, ${get_objdFlags(element)}, acName${index}, ${el_value}, ${get_objdData(element)}},`;

				objectlist += var_objd;
				break;
			}
			case OTYPE.ARRAY: {
				let arr_objd = `\n  {0x00, DTYPE_${DTYPE.UNSIGNED8}, ${8}, ATYPE_RO, acName${index}_00, ${element.items.length - 1}, NULL},`; // max subindex
				let bitsize = dtype_bitsize[element.dtype]; /* TODO what if it is array of strings? */
				let subindex = 0;
				element.items.forEach(item => {
					if (subindex > 0) { 	// skip max subindex, already done
						var subi = subindex_padded(subindex);
						arr_objd += `\n  {0x${subi}, DTYPE_${element.dtype}, ${bitsize}, ${get_objdFlags(item)}, acName${index}_${subi}, ${item.value || 0}, ${item.data || 'NULL'}},`;
					}
					subindex ++;
				});

				objectlist += arr_objd;
				break;
			}
			case OTYPE.RECORD: {
				let rec_objd = `\n  {0x00, DTYPE_${DTYPE.UNSIGNED8}, ${8}, ATYPE_RO, acName${index}_00, ${element.items.length - 1}, NULL},`; // max subindex
				let subindex = 0;
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
			}
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

// ####################### ESI.xml generating ####################### //

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

function esiDTbitsize(dtype) {
	return ESI_DT[dtype].bitsize;
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
			}
			return bitsize;
		}
		default:
			alert(`Element ${element} has unexpected OTYPE ${element.otype}`);
			break;
	}
}

//See ETG2000 for ESI format
function esi_generator(form, od, indexes)
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
	// Add objects dictionary data types
	indexes.forEach(index => {
		const element = od[index];
		const el_name = esiDtName(element, index);
		
		if (element.otype == OTYPE.VAR) {
			addVariableType(element); // variable types will have to be be done later anyway, add to that queue
		} else if (!customTypes[el_name]) {
			// generate data types code for complex objects
			const bitsize = esiBitsize(element);
			customTypes[el_name] = true;
			esi += `\n              <DataType>`;
			
			if (element.otype == OTYPE.ARRAY) {
				addVariableType(element); // cannot add variable type now that array code is being generated, add to queue
				let esi_type = ESI_DT[element.dtype];
				let arr_bitsize = (element.items.length - 1) * esi_type.bitsize
				esi += `\n                <Name>${el_name}ARR</Name>\n                <BaseType>${esi_type.name}</BaseType>\n                <BitSize>${arr_bitsize}</BitSize>`;
				esi += `\n                <ArrayInfo>\n                  <LBound>1</LBound>\n                  <Elements>${element.items.length - 1}</Elements>\n                </ArrayInfo>`;
				esi += `\n              </DataType>`;
				esi += `\n              <DataType>`;
			}
			esi += `\n                <Name>${el_name}</Name>\n                <BitSize>${bitsize}</BitSize>`;
			esi += `\n                <SubItem>\n                  <SubIdx>0</SubIdx>\n                  <Name>Max SubIndex</Name>\n                  <Type>USINT</Type>\n                  <BitSize>8</BitSize>\n                  <BitOffs>0</BitOffs>\n                  <Flags>\n                    <Access>ro</Access>\n                  </Flags>\n                </SubItem>`;
			if (element.otype == OTYPE.ARRAY) {
	 			let arr_bitsize = (element.items.length - 1) * esiDTbitsize(element.dtype);
				esi += `\n                <SubItem>\n                  <Name>Elements</Name>\n                  <Type>${el_name}ARR</Type>\n                  <BitSize>${arr_bitsize}</BitSize>\n                  <BitOffs>16</BitOffs>\n                  <Flags>\n                    <Access>ro</Access>\n                  </Flags>\n                </SubItem>`;
			} else if (element.otype == OTYPE.RECORD) {
				let subindex = 0;
				let bits_offset = 16;
				element.items.forEach(subitem => {
					if (subindex > 0) { // skipped Max Subindex
						addVariableType(subitem); // cannot add variable type now that record code is being generated
						let subitem_dtype = ESI_DT[subitem.dtype];
						let subitem_bitsize = subitem_dtype.bitsize
						esi += `\n                <SubItem>\n                  <SubIdx>${subindex}</SubIdx>\n                  <Name>${subitem.name}</Name>\n                  <Type>${subitem_dtype.name}</Type>\n                  <BitSize>${subitem_bitsize}</BitSize>\n                  <BitOffs>${bits_offset}</BitOffs>\n                  <Flags>\n                    <Access>ro</Access>\n                  </Flags>\n                </SubItem>`;
						bits_offset += subitem_bitsize;
					}
					subindex++;
				});
			}
			esi += `\n              </DataType>`;
		}
	});
	// Add variable type
	Object.entries(variableTypes).forEach(variableType => {
		esi += `\n              <DataType>`;
		esi += `\n                <Name>${variableType[0]}</Name>\n                <BitSize>${variableType[1]}</BitSize>`;			
		esi += `\n              </DataType>`;
	});
	esi += `\n            </DataTypes>\n            <Objects>`;
	// Add objects dictionary
	indexes.forEach(index => {
		const element = od[index];
		const el_dtype = esiDtName(element, index);
		const bitsize = esiBitsize(element);
		esi += `\n              <Object>\n                <Index>#x${index}</Index>\n                <Name>${element.name}</Name>\n                <Type>${el_dtype}</Type>\n                <BitSize>${bitsize}</BitSize>\n                <Info>`;
		if (element.data) {
			if (element.dtype == DTYPE.VISIBLE_STRING) {
				esi += `\n                  <DefaultString>${element.data}</DefaultString>`;	
			}
		} else if (element.value) {
			esi += `\n                  <DefaultValue>${element.value ? "#x"+parseInt(element.value).toString(16) : 0}</DefaultValue>`;
		}
		//Add object subitems for complex types
		if (element.items) {
			const max_subindex_value = element.items.length - 1;
			let subindex = 0;
			element.items.forEach(subitem => {
				const defaultValue = (subindex > 0) ? subitem.value : max_subindex_value;
				esi += `\n                  <SubItem>\n                    <Name>${subitem.name}</Name>\n                    <Info>\n                      <DefaultValue>${defaultValue}</DefaultValue>\n                    </Info>\n                  </SubItem>`;
				subindex++;
			});
		}
		const isMandatory = SDO_category[index]; /* TODO review which objects are mandatory */
		esi += `\n                </Info>\n                <Flags>\n                  <Access>ro</Access>${ isMandatory ? '\n                  <Category>m</Category>' : '' }\n                </Flags>\n              </Object>`;
	});
	esi += `\n            </Objects>\n          </Dictionary>\n        </Profile>\n        <Fmmu>Outputs</Fmmu>\n        <Fmmu>Inputs</Fmmu>\n        <Fmmu>MBoxState</Fmmu>\n`;
	//Add Rxmailbox sizes
	esi += `        <Sm DefaultSize="${parseInt(form.MailboxSize.value).toString(10)}" StartAddress="#x${indexToString(form.RxMailboxOffset.value)}" ControlByte="#x26" Enable="1">MBoxOut</Sm>\n`;
	//Add Txmailbox sizes
	esi += `        <Sm DefaultSize="${parseInt(form.MailboxSize.value).toString(10)}" StartAddress="#x${indexToString(form.TxMailboxOffset.value)}" ControlByte="#x22" Enable="1">MBoxIn</Sm>\n`;
	//Add SM2
	esi += `        <Sm StartAddress="#x${indexToString(form.SM2Offset.value)}" ControlByte="#x24" Enable="1">Outputs</Sm>\n`;
	//Add SM3
	esi += `        <Sm StartAddress="#x${indexToString(form.SM3Offset.value)}" ControlByte="#x20" Enable="1">Inputs</Sm>\n`;
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
	const bytes_per_rule = 32;
	for(var count = 0 ; count < record.length ; count++) //initialize array
		record[count] = 0xFF;
		//Start of EEPROM contents; A lot of information can be found in 5.4 of ETG1000.6
	const pdiControl = (form.ESC.value == 'LAN9252') ? 0x80 : 0x05;
	const spiMode = parseInt(form.SPImode.value);
	const reserved_0x05 = (form.ESC.value == 'AX58100') ? 0x001A : 0x00; // enable IO for SPI driver on AX58100:
	// Write 0x1A value (INT edge pulse length, 8 mA Control + IO 9:0 Drive Select) to 0x0A (Host Interface Extend Setting and Drive Strength
	const configdata_bytecount = (form.ESC.value == 'AX58100') ? 14 : 7; // configdata needs to reach 0x0A

	//WORD ADDRESS 0-7
	writeEEPROMbyte_byteaddress(pdiControl,0,record); //PDI control: SPI slave (mapped to register 0x0140)
	writeEEPROMbyte_byteaddress(0x06,1,record); //ESC configuration: Distributed clocks Sync Out and Latch In enabled (mapped register 0x0141)
	writeEEPROMbyte_byteaddress(spiMode,2,record); //SPI mode (mapped to register 0x0150)
	writeEEPROMbyte_byteaddress(0x44,3,record); //SYNC /LATCH configuration (mapped to 0x0151). Make both Syncs output
	writeEEPROMword_wordaddress(0x0064,2,record);//Syncsignal Pulselenght in 10ns units(mapped to 0x0982:0x0983)
	writeEEPROMword_wordaddress(0x00,3,record); //Extended PDI configuration (none for SPI slave)(0x0152:0x0153)
	writeEEPROMword_wordaddress(0x00,4,record); //Configured Station Alias (0x0012:0x0013)
	writeEEPROMword_wordaddress(reserved_0x05,5,record); //Reserved, 0 (when not AX58100)
	writeEEPROMword_wordaddress(0x00,6,record); //Reserved, 0
	writeEEPROMword_wordaddress(FindCRC(record,14),7,record); //CRC
	for (var bytecount = 0 ; bytecount < configdata_bytecount ; bytecount++) {
		configdata += (record[bytecount]+0x100).toString(16).slice(-2).toUpperCase();//store EEPROM data for future use in ESI file
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

// ####################### ecat_options.h generation ####################### //

function ecat_options_generator(form, od, indexes)
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
	const MAX_MAPPINGS = getMaxMappings(od, indexes);
	ecat_options += `#define MAX_MAPPINGS_SM2 ${MAX_MAPPINGS.SM2}`
				+ `\n#define MAX_MAPPINGS_SM3 ${MAX_MAPPINGS.SM3}\n\n`
	// PDO buffer config
	ecat_options += '#define MAX_RXPDO_SIZE   512'
				+ '\n#define MAX_TXPDO_SIZE   512\n\n'
				+ '#endif /* __ECAT_OPTIONS_H__ */\n';

	return ecat_options;

	function getMaxMappings(od, indexes) {
		let MAX_MAPPINGS_SM2 = 0;
		let MAX_MAPPINGS_SM3 = 0;
		indexes.forEach(index => {
			const element = od[index];
			if(element.pdo_mappings) {
				element.pdo_mappings.forEach(mapping => {
					if (mapping == rxpdo) { ++MAX_MAPPINGS_SM2 }
					if (mapping == txpdo) { ++MAX_MAPPINGS_SM3 }
				});
			};
			if(element.items) {
				element.items.forEach(subitem => {
					if(subitem.pdo_mappings) {
						subitem.pdo_mappings.forEach(mapping => {
							if (mapping == rxpdo) { ++MAX_MAPPINGS_SM2 }
							if (mapping == txpdo) { ++MAX_MAPPINGS_SM3 }
						});
					};		
				});
			}
		});
		return { SM2: MAX_MAPPINGS_SM2, SM3: MAX_MAPPINGS_SM3 };
	}
}

// ####################### utypes.h generation ####################### //

function utypes_generator(form, od, indexes) {
	utypes = '#ifndef __UTYPES_H__\n#define __UTYPES_H__\n\n#include "cc.h"\n\n/* Object dictionary storage */\n\ntypedef struct\n{\n   /* Identity */\n'
	utypes += '\n   uint32_t serial;\n\n';
	/* TODO implement OD type declaration */
	utypes += '\n} _Objects;\n\nextern _Objects Obj;\n\n#endif /* __UTYPES_H__ */\n';

	return utypes;
}

// ####################### Handle modal dialog ####################### //

var modal = {};

function modalSetup() {
	// Get the modal
	modal = document.getElementById("editObjectModal");
	modal.form = getDialogForm();
}

// When the user clicks the button, open the modal 
function modalOpen() {
	modal.style.display = "block";
}

function modalClose() {
	modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modalClose();
	}
}


window.onload = (event) => {
	modalSetup();
	tryRestoreLocalBackup();
	form = getForm();
	// for convinience during tool development, trigger codegen on page refresh
	processForm(form); // TODO remove me
	
	const _isComputerFast = automaticCodegen;
	
	if (_isComputerFast) {
		processForm(form); // make sure displayed code is up to date at startup, e.g redo, if it came from backup
	
		document.getElementById('GenerateFilesButton').style.display = 'none'; // 'generate' button no longer needed
		form.addEventListener('change', function() {
			onFormChanged();
		});
	}
}


function getDialogForm() {
	return document.getElementById('EditObjectForm');
}

// update control values
function modalUpdate(index, objd) {
	modal.form.Index.value = `0x${index}`;
	modal.form.ObjectName.value = objd.name;
	modal.form.DTYPE.value = objd.dtype || DTYPE.UNSIGNED8;
	modal.form.Access.value = objd.access || 'RO';
	modal.objd = objd;
}

// ####################### Modal dialogs for OD edition ####################### //

function editExistingObject(odSectionName, index, otype) {
	const od = getObjDictSection(odSectionName);
	var objd = od[index]; 
	modal.index_initial_value = index;
	checkObjectType(otype, objd);
	modalUpdate(index, objd);
}

function addNewObject(odSectionName, otype) {
	const readableNames = {
		VAR: 'Variable',
		ARRAY: 'Array',
		RECORD: 'Record'
	}
	const objd = { 
		otype: otype,
		name: `New ${readableNames[otype]}`,
		access: 'RO',
	};
	var index = getFirstFreeIndex(odSectionName);
	delete modal.index_initial_value;
	modalUpdate(index, objd);
}

function editVAR_Dialog(odSectionName, indexValue = null) {
	const otype = OTYPE.VAR;
	const index = indexToString(indexValue);
	var actionName = "Edit";
	modal.odSectionName = odSectionName;

	if (objectExists(odSectionName, index)) {
		editExistingObject(odSectionName, index, otype);
		modal.form.DTYPE.value = modal.objd.dtype;
	} else {
		addNewObject(odSectionName, otype);
		actionName = "Add"
	}
	document.getElementById('editObjectTitle').innerHTML = `${actionName} ${odSectionName.toUpperCase()} variable`;
	document.getElementById('dialogRowDtype').style.display = "";
	document.getElementById('dialogRowValue').style.display = "";
	modalOpen();
}

function editARRAY_Dialog(odSectionName, indexValue = null) {
	const otype = OTYPE.ARRAY;
	const index = indexToString(indexValue);
	var actionName = "Edit";
	modal.odSectionName = odSectionName;

	if (objectExists(odSectionName, index)) {
		editExistingObject(odSectionName, index, otype);
		modal.form.DTYPE.value = modal.objd.dtype;
	} else {
		addNewObject(odSectionName, otype);
		actionName = "Add"
	}
	document.getElementById('editObjectTitle').innerHTML = `${actionName} ${odSectionName.toUpperCase()} array`;
	document.getElementById('dialogRowDtype').style.display = "";
	document.getElementById('dialogRowValue').style.display = "none";  // hide unused controls
	modalOpen();
}

function editRECORD_Dialog(odSectionName, indexValue = null) {
	const otype = OTYPE.RECORD;
	const index = indexToString(indexValue);
	var actionName = "Edit";
	modal.odSectionName = odSectionName;

	if (objectExists(odSectionName, index)) {
		editExistingObject(odSectionName, index, otype);
	} else {
		addNewObject(odSectionName, otype);
		actionName = "Add"
	}
	document.getElementById('editObjectTitle').innerHTML = `${actionName} ${odSectionName.toUpperCase()} record`;
	document.getElementById('dialogRowDtype').style.display = "none"; // hide unused controls
	document.getElementById('dialogRowValue').style.display = "none";
	modalOpen();
}

function onEditObjectSubmit(modalform) {
	const objd = modal.objd;
	const objectType = objd.otype;
	const index = indexToString(modalform.Index.value);

	objd.name = modalform.ObjectName.value;

	switch (objectType) {
		case OTYPE.VAR:
			objd.dtype = modalform.DTYPE.value;
			
			if (objd.dtype == DTYPE.VISIBLE_STRING) {
				objd.data = '' 
			} else {
				objd.value = modalform.InitalValue.value;
			}
			break;
		case OTYPE.ARRAY:
			objd.dtype = modalform.DTYPE.value;
			
			break;
		case OTYPE.RECORD:
		
			break;
		default:
			alert(`Unexpected type ${objectType} on object ${modalform.ObjectName} being edited!`);
			break;
	}
	const odSection = getObjDictSection(modal.odSectionName);
	if (modal.index_initial_value) {
		removeObject(odSection, modal.index_initial_value); // detach from OD, to avoid duplicate if index changed
	}
	addObject(odSection, objd, index);	// attach updated object
	modalClose();
	showSection(modal.odSectionName);
	delete modal.odSectionName;
	modal.objd = {};
	
	onFormChanged();
}

function onRemoveClick(odSectionName, indexValue, subindex = null) {
	const index = indexToString(indexValue);
	if (confirm(`Are you sure you want to remove object 0x${index}?`)) {
		
		const odSection = getObjDictSection(odSectionName);
		if (subindex) {
			// TODO remove subindex
		} else {
			removeObject(odSection, index);
		}
		showSection(odSectionName);
		onFormChanged();
	}
}

function onFormChanged() {
	processForm(getForm()); // 
	saveLocalBackup();  // persist OD changes over page reload
}

// ####################### Display Object Dictionary in building ####################### //

function reloadOD_Sections() {
	showSection(sdo);
	showSection(txpdo);
	showSection(rxpdo);
}

function showSection(odSectionName) {
	const odSection = getObjDictSection(odSectionName);
	var indexes = getUsedIndexes(odSection);
	var section = '';
	indexes.forEach(index => {
		const objd = odSection[index];
		section += `<dt>0x${index} "${objd.name}" ${objd.otype} ${objd.dtype ?? ''}`
		section += `<button onClick='onRemoveClick(${odSectionName}, 0x${index})'>Remove object</button>`
		section += `<button onClick='edit${objd.otype}_Dialog(${odSectionName}, 0x${index})'>Edit object</button>`;
		section += `</dt>`;
		if (objd.items) {
			section += `<dd>-items<dd>`;
		}
	});
	document.getElementById(`tr_${odSectionName}`).innerHTML = section;
}