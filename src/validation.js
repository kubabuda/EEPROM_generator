/**
 * SOES EEPROM generator
 * Object Dictionary edition logic

* This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2021
 */
'use strict'

/** Value validation logic */

function sanitizeString(value) {
	value = value.trim();
	charsToRemove.forEach(c => {
		value = value.replaceAll(c, '');
	});
	return value;
}


function sanitizeBool(value, dtype) {
	if (!value) { return '0'; }
	return (value == '0') ? '0' : '1';
}

function sanitizeFloat(value, dtype) {
	let minusSign = value.startsWith('-');
	let result = '';
	
	if (value.length == 1 && minusSign) { return '-'; }
	const matched = value.replaceAll(',', '.').match(/[0-9\.]/g)
	if (!matched) {			
		return '';
	}
	const s = matched.join('').split('.');
	if (s.length > 1) {
		result = `${s[0]}.${s.splice(1).join('')}`;
	} else if (value.endsWith('.')) {
		result = `${s[0]}.`
	} else {
		result = s[0];
	}
	return minusSign ? `-${result}` : result;	
}

function sanitizeInt(value, dtype) {
	let minusSign = value.startsWith('-');
	let result = '';

	if (value.length == 1 && minusSign) { return '-'; }
	const matched = value.match(/[0-9]/g);
	if (!matched) { return '' }
	result = matched.join('');
	return minusSign ? `-${result}` : result;
}

function sanitizeUint(value, dtype) {
	const matched = value.match(/[0-9]/g);
	if (!matched) { return '' }
	return matched.join('');
}

function sanitizeInitialValue(value, dtype) {
	if (value == null) {
		return '0'; // always assign initial value
	}
	if (dtype == DTYPE.VISIBLE_STRING) {
		// no sanitization for string values: all characters allowed
		return value;
	} else if (dtype == DTYPE.REAL32 || dtype == DTYPE.REAL64) {
		return sanitizeFloat(value, dtype);
	} else if (dtype == DTYPE.INTEGER8 || dtype == DTYPE.INTEGER16 || dtype == DTYPE.INTEGER32 || dtype == DTYPE.INTEGER64) {
		return sanitizeInt(value, dtype);
	} else if (dtype == DTYPE.BOOLEAN) {
		return sanitizeBool(value, dtype);
	} else {
		return sanitizeUint(value, dtype);
	}
}

function variableName(objectName) {
	var variableName = sanitizeString(objectName);
	charsToReplace.forEach(c => {
		variableName = variableName.replaceAll(c, '_');
	});
	return variableName;
}

function checkIsSubitemNameFree(objd, newName, subIndex = null) {
	const names = new Set();
	for (let i = 0; i < objd.items.length; ++i) {
		if (subIndex == null || i != subIndex) {
			const n = objd.items[i].name;
			if (names.has(n)) { 
				alert(`Object ${objd.name} (${objd.otype}) has duplicate name subitems ${n}`);
			}
			names.add(n);
		}
	}
	return !names.has(newName);
}

function getNextFreeSubitemName(objd, name) {
	let newName = name;
	let i = 1;
	while (!checkIsSubitemNameFree(objd, newName)) {
		newName = `${name} ${i}`;
		i++;
	}
	return newName;
}

function addArraySubitem(objd, dtype) {
	if (objd.otype != OTYPE.ARRAY) { alert(`${objd} is not ARRAY, cannot add subitem`); return; }
	if (!objd.items) { alert(`${objd} does not have items list, cannot add subitem`); return; }
	let newName = getNextFreeSubitemName(objd, 'New array subitem');
	const newSubitem = { name: newName, value: dtype_default_epmty_value[dtype] };
	objd.items.push(newSubitem);

	return newSubitem;
}

function addRecordSubitem(objd, dtype) {
	if (objd.otype != OTYPE.RECORD) { alert(`${objd} is not RECORD, cannot add subitem`); return; }
	if (!objd.items) { alert(`${objd} does not have items list, cannot add subitem`); return; }
	let newName = getNextFreeSubitemName(objd, 'New record subitem');
	const newSubitem = { name: newName, dtype: dtype, value: dtype_default_epmty_value[dtype] }
	objd.items.push(newSubitem);

	return newSubitem;
}
