/**
 * SOES EEPROM generator
 * Project backup save and restore

 * This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2024
 */
'use strict'

// ####################### Backup serialization + deserialization ####################### //

function isValidBackup(backup) {
	if (!backup || !backup.form || !backup.od ) {
		if (!confirm('Backup is incomplete or invalid, proceed anyway?')) {
			return false;
		}
	}
	return true;
}

function isBackedUp(formControl) {
	return formControl.type != "button";
}

function prepareBackupObject(form, dc) {
	const formValues = {};
	if (form) {
		Object.entries(form).forEach(formEntry => {
			const formControl = formEntry[1]; // entry[0] is form control order number
			if(isBackedUp(formControl) && formControl.value) {
				formValues[formControl.name] = formControl.value;
			};
		});
	}
	const backup = {
		form: formValues,
		od: getObjDict(),
		dc: dc,
	};

	return backup;
}

function loadBackup(backupObject, form, _dc) {
	if (backupObject.od) {
		setObjDictSection(sdo, backupObject.od.sdo);
		setObjDictSection(txpdo, backupObject.od.txpdo);
		setObjDictSection(rxpdo, backupObject.od.rxpdo);
	}

	if (backupObject.dc) {
		backupObject.dc.forEach(dc => _dc.push(dc));
	}
	
	setFormValues(form, backupObject);
}

function setFormValues(form, backupObject) {
	if (form) {
		Object.entries(form).forEach(formEntry => {
			const formControl = formEntry[1]; // entry[0] is index
			const formControlValue = backupObject.form[formControl.name];
			if (isBackedUp(formControl) && formControlValue) {
				setFormControlValue(formControl, formControlValue);
			};
		});
	}
}

// use to update getEmptyFrom in tests, when new forms are added
function getEmptyFrom(form) {
	const emptyForm = {};
	Object.entries(form).forEach(formEntry => {
		const formControl = formEntry[1]; // entry[0] is index
		if (formControl.name) {
			emptyForm[formControl.name] = { name: formControl.name };
		}
	});
	return emptyForm;
}

function setFormControlValue(formControl, formControlValue) {
	if (formControl.name.startsWith('CoeDetailsEnable')) {
		if (formControlValue == true) {
			formControl.checked = true;
		} else {
		}
	} else {
		formControl.value = formControlValue;
	}
}

function prepareBackupFileContent(form, _dc) {
	var backupObject = prepareBackupObject(form, _dc);
	var backupFileContent = JSON.stringify(backupObject, null, 2); // pretty print
	return backupFileContent;
}

// ####################### Backup using JSON file from filesystem ####################### //

// Localstorage limit is usually 5MB, super large object dictionaries on older browsers might be problematic

function downloadBackupFile(form, _dc) {
	const backupFileContent = prepareBackupFileContent(form, _dc); // pretty print
	downloadFile(backupFileContent, 'esi.json', 'text/json');
}

function restoreBackup(fileContent, form, _dc) {
	var backup = JSON.parse(fileContent);
	if (isValidBackup(backup)) {
		loadBackup(backup, form, _dc);
	}
}

// ####################### Backup using browser localstorage ####################### //

/** persist OD and settings changes over page reload */
function saveLocalBackup(form) {
	localStorage.etherCATeepromGeneratorBackup = prepareBackupFileContent(form);
}

function tryRestoreLocalBackup(form, _dc) {
	if (localStorage.etherCATeepromGeneratorBackup)  {
		restoreBackup(localStorage.etherCATeepromGeneratorBackup, form, _dc);
	}	
}

function resetLocalBackup() {
	if (localStorage.etherCATeepromGeneratorBackup) {
		delete localStorage.etherCATeepromGeneratorBackup;
	}
}