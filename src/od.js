/**
 * SOES EEPROM generator
 * Object Dictionary edition logic

* This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2024
 */
'use strict'

/** Object Dictionary sections edited by UI
 * Assumption: single non dynamic PDO */

function getEmptyObjDict() {
	return {
		sdo : {},
		txpdo : {}, // addding PDO requires matching SDO in Sync Manager, and PDO mapping
		rxpdo : {}, // this will be done when stitching sections during code generation
	};
}

function objectExists(odSection, index) {
	return index && odSection[index];
}

function checkObjectType(expected, objd) {
	if (objd.otype != expected) {
		const msg = `Object ${objd.name} was expected to be OTYPE ${expected} but is ${objd.otype}`;
		alert(msg);
		throw new Exception(msg);
	}
}

function addObject(od, objd, index) {
	if (od[index]) {
		alert(`Object ${objd.name} duplicates 0x${index}: ${od[index].name} !`);
		// throw new Exception(msg);
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

function isInArray(array, seekValue) {
	return array && (array[0] == seekValue
		|| array.find(currentValue => currentValue == seekValue));
}

// returns index of object with given name, or null
function findObjectIndexByName(odSections, name) {
	for(let sectionName of OD_sections) {
		const sdoSection = odSections[sectionName];
		const indexes = getUsedIndexes(sdoSection);
		
		for(let i = 0; i < indexes.length; ++i) {
			const objd = sdoSection[indexes[i]];
			if (objd.name == name) {
				return indexes[i];
			}
		};
	};
	return null;
}

// ####################### Building Object Dictionary model ####################### //

/** Takes OD entries from UI SDO section and adds to given OD */
function addSDOitems(odSections, od) {
	const sdoSection = odSections.sdo;
	const indexes = getUsedIndexes(sdoSection);

	indexes.forEach(index => {
		const objd = sdoSection[index];
		objd.isSDOitem = true;
		objectlist_link_utypes(objd);

		addObject(od, objd, index);
	});
}
/** Returns true if any object in given Object Dictionary has mapping to PDO with given name */
function isPdoWithVariables(od, indexes, pdoName) {
	for (let i = 0; i < indexes.length; i++) {
		const index = indexes[i];
		const objd = od[index];
		if (isInArray(objd.pdo_mappings, pdoName)) {
			return true;
		}
	}
	return false;
}
/** Regardles of value set, SDK was generating RXPDO mappings as SDO1600
 * This offset _can_ be changed, not sure why one would need it
 */
function getSM2_MappingOffset(form) {
	return	parseInt(form.SM2Offset.value);
}
/** Takes OD entries from UI RXPDO section and adds to given OD */
function addRXPDOitems(form, odSections, od, booleanPaddingCount) {
	const rxpdoSection = odSections.rxpdo;
	const pdo = {
		name : rxpdo,
		SMassignmentIndex : '1C12',
		smOffset : getSM2_MappingOffset(form), // usually 0x1600
	};
	return addPdoObjectsSection(od, rxpdoSection, pdo, booleanPaddingCount);
}
/** Takes OD entries from UI TXPDO section and adds to given OD */
function addTXPDOitems(form, odSections, od, booleanPaddingCount) {
	const txpdoSection = odSections.txpdo;
	const pdo = {
		name : txpdo,
		SMassignmentIndex : '1C13',
		smOffset : parseInt(form.SM3Offset.value), // usually 0x1A00
	};
	return addPdoObjectsSection(od, txpdoSection, pdo, booleanPaddingCount);
}

function esiDTbitsize(dtype) {
	return ESI_DT[dtype].bitsize;
}

function varBitsize(objd) {
	let bitsize = esiDTbitsize(objd.dtype);
	if (objd.dtype == DTYPE.VISIBLE_STRING) {
		bitsize *= parseInt(objd.size);
	}
	return bitsize;
}

/** 
 * Takes OD entries from given UI SDO/PDO section and adds to given OD
 * using provided SM offset, and SM assignment address.
 
 * Available sections are 'sdo', 'txpdo', 'rxpdo'
 */
function addPdoObjectsSection(od, odSection, pdo, booleanPaddingCount) {
	let currentSMoffsetValue = pdo.smOffset;
	const indexes = getUsedIndexes(odSection);
	
	if (indexes.length) {
		const pdoAssignments = ensurePDOAssignmentExists(od, pdo.SMassignmentIndex);

		indexes.forEach(index => {
			const objd = odSection[index];
			const currentOffset = indexToString(currentSMoffsetValue)
			
			const pdoMappingObj = { otype: OTYPE.RECORD, name: objd.name, items: [
				{ name: 'Max SubIndex' },
			]};
			// create PDO assignment to SM
			const pdoAssignment = { name: "PDO Mapping", value: `0x${currentOffset}` };
			addPdoMapping(objd, pdo.name);
			
			objectlist_link_utypes(objd);

			switch (objd.otype) {
			case  OTYPE.VAR: {
				// create PDO mapping
				pdoMappingObj.items.push({ name: objd.name, dtype: DTYPE.UNSIGNED32, value: getPdoMappingValue(index, 0, objd) });
				if (objd.dtype == DTYPE.BOOLEAN) { 
					addBooleanPadding(pdoMappingObj.items, ++booleanPaddingCount);
				}
				break;
			} 
			case OTYPE.ARRAY: {
				let subindex = 1;
				objd.items.slice(subindex).forEach(subitem => { 
					// create PDO mappings
					pdoMappingObj.items.push({ name: subitem.name, dtype: DTYPE.UNSIGNED32, value: getPdoMappingValue(index, subindex, objd) });
					// TODO handle padding on array of booleans
					++subindex;
				});
				break;
			}
			case OTYPE.RECORD: {
				let subindex = 1;
				objd.items.slice(subindex).forEach(subitem => {
					// create PDO mappings
					pdoMappingObj.items.push({ name: subitem.name, dtype: DTYPE.UNSIGNED32, value: getPdoMappingValue(index, subindex, subitem) });
					if (subitem.dtype == DTYPE.BOOLEAN) { 
						addBooleanPadding(pdoMappingObj.items, ++booleanPaddingCount);
					}
					++subindex;
				});
				break;
			}
			default: {
				alert(`${pdoMappingValue} object ${index} ${objd.name} has unexpected object type ${objd.otype}!`);
				break;
			}}

			addObject(od, pdoMappingObj, currentOffset);
			pdoAssignments.items.push(pdoAssignment);

			addObject(od, objd, index);

			++currentSMoffsetValue;
		});

		return booleanPaddingCount;

		function addBooleanPadding(mappingOjbItems, paddingCount) {
			mappingOjbItems.push({ name: `Padding ${paddingCount}`, dtype: DTYPE.UNSIGNED32, value: `0x0000000${booleanPaddingBitsize}` });
		}
	}

	function addPdoMapping(objd, pdoName) {
		// make sure there is space
		if (!objd.pdo_mappings) {
			objd.pdo_mappings = [];
		}
		// mark object as PDO mapped, if it is not already
		if(!isInArray(objd.pdo_mappings, pdoName)) {
			objd.pdo_mappings.push(pdoName);
		}
	}
	
	function ensurePDOAssignmentExists(od, index) {	
		let pdoAssignments = od[index];
		if (!pdoAssignments) {
			pdoAssignments = { otype: OTYPE.ARRAY, dtype: DTYPE.UNSIGNED16, name: `Sync Manager ${index[3]} PDO Assignment`, items: [
				{ name: 'Max SubIndex' },
			]};
			od[index] = pdoAssignments;
		}
		return pdoAssignments;
	}
	
	function getPdoMappingValue(index, subindex, objd) {
		function toByte(value) {
			let result = value.toString(16).slice(0, 2);
			while (result.length < 2) {
				result = `0${result}`;
			}
			return result;
		}

		return `0x${index}${toByte(subindex)}${toByte(varBitsize(objd))}`;
	}	
}
/** populates mandatory objects with values from UI */
function populateMandatoryObjectValues(form, od) {
	if (form) {
		od['1008'].value = form.TextDeviceName.value;
		od['1008'].size  = form.TextDeviceName.value.length;
		od['1009'].value = form.HWversion.value;
		od['1009'].size  = form.HWversion.value.length;
		od['100A'].value = form.SWversion.value;
		od['100A'].size  = form.SWversion.value.length;
		od['1018'].items[1].value = parseInt(form.VendorID.value);
		od['1018'].items[2].value = parseInt(form.ProductCode.value);
		od['1018'].items[3].value = parseInt(form.RevisionNumber.value);
		od['1018'].items[4].value = parseInt(form.SerialNumber.value);
	}
}
/** builds complete object dictionary, with values from UI */
function buildObjectDictionary(form, odSections) {
	const od = getMandatoryObjects();
	populateMandatoryObjectValues(form, od);
	// populate custom objects
	addSDOitems(odSections, od);
	let booleanPaddingCount = addTXPDOitems(form, odSections, od, 0);
	addRXPDOitems(form, odSections, od, booleanPaddingCount);

	return od;
}

// ####################### Object Dictionary index manipulation ####################### //

function indexToString(index) {
	const indexValue = parseInt(index);
	return indexValue.toString(16).toUpperCase();
}
/** returns list of indexes that are used in given OD, as array of integer values */
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

// ####################### Object Dictionary edition ####################### //

function getFirstFreeIndex(odSections, odSectionName) {
	const addressRangeStart = {
		"sdo": 0x2000,
		"txpdo": 0x6000,
		"rxpdo": 0x7000,
	}
	let result = addressRangeStart[odSectionName];
	const odSection = odSections[odSectionName];
	while (odSection[indexToString(result)]) {
		result++;
	}

	return indexToString(result);
}

function getNextFreeItemName(odSections, name) {
	let i = 0;
	OD_sections.forEach(section => {
		Object.entries(odSections[section]).forEach(object => {
			if (object[1].name == name) {
				i += 1;
			}
		})
	});
	if (i == 0) {
		return name;
	}
	return `${name} ${i}`;
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

/** returns new object description for given PDO section  */
function getNewObjd(odSections, odSectionName, otype, dtype) {
	if (dtype == undefined) {
		dtype = DTYPE.UNSIGNED8;
	}
	const readableNames = {
		VAR: 'Variable',
		ARRAY: 'Array',
		RECORD: 'Record'
	}
	// get free name 
	let name = getNextFreeItemName(odSections, `New ${readableNames[otype]}`);
	const objd = { 
		otype: otype,
		name: name,
		access: 'RO',
	};
	switch(otype) {
	case OTYPE.ARRAY: {
		objd.dtype = dtype;
		objd.items = [
			{ name: 'Max SubIndex' },
		];
		objd.items.push(getNewArraySubitem(objd, dtype));
		break;
	}
	case OTYPE.RECORD: {
		objd.items = [
			{ name: 'Max SubIndex' },
		];
		objd.items.push(getNewRecordSubitem(objd, dtype));
		break;
	}
	default: {
		objd.dtype = dtype;
		break;
	}}
	if (odSectionName == txpdo || odSectionName == rxpdo) {
		objd.pdo_mappings = [ odSectionName ];
	}
	return objd;
}

function getNewArraySubitem(objd, dtype) {
	if (objd.otype != OTYPE.ARRAY) { alert(`${objd} is not ARRAY, cannot add subitem`); return; }
	if (!objd.items) { alert(`${objd} does not have items list, cannot add subitem`); return; }
	let newName = getNextFreeSubitemName(objd, 'New array subitem');
	const newSubitem = { name: newName, value: dtype_default_epmty_value[dtype] };

	return newSubitem;
}

function getNewRecordSubitem(objd, dtype) {
	if (objd.otype != OTYPE.RECORD) { alert(`${objd} is not RECORD, cannot add subitem`); return; }
	if (!objd.items) { alert(`${objd} does not have items list, cannot add subitem`); return; }
	let newName = getNextFreeSubitemName(objd, 'New record subitem');
	const newSubitem = { name: newName, dtype: dtype, value: dtype_default_epmty_value[dtype] }

	return newSubitem;
}

function setArrayLength(objd, newLength) {
	// sanity checks, TODO what is max array length supported
	if (newLength < 1) { 
		return; 
	}
	const size = newLength + 1; // Max SubIndex + at least 1 item
	while (objd.items.length > size) { 
		objd.items.pop();
	}
	while (objd.items.length < size) { 
		objd.items.push(getNewArraySubitem(objd, objd.dtype));
	}
}