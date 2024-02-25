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

function prepareBackupObject(form, odSections, dc) {
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
		od: odSections,
		dc: dc,
	};

	return backup;
}

function loadBackup(backupObject, form, odSections, dc) {
	if (backupObject.od) {
		odSections.sdo = backupObject.od.sdo;
		odSections.txpdo = backupObject.od.txpdo;
		odSections.rxpdo = backupObject.od.rxpdo;
	}

	if (backupObject.dc) {
		backupObject.dc.forEach(d => dc.push(d));
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

function prepareBackupFileContent(form, odSections, dc) {
	const backupObject = prepareBackupObject(form, odSections, dc);
	const backupFileContent = JSON.stringify(backupObject, null, 2); // pretty print
	return backupFileContent;
}

// ####################### Backup using JSON file from filesystem ####################### //

// Localstorage limit is usually 5MB, super large object dictionaries on older browsers might be problematic

function downloadBackupFile(form, odSections, dc) {
	const backupFileContent = prepareBackupFileContent(form, odSections, dc); // pretty print
	downloadFile(backupFileContent, 'esi.json', 'text/json');
}

function restoreBackup(fileContent, form, odSections, dc) {
	const backup = JSON.parse(fileContent);
	if (isValidBackup(backup)) {
		loadBackup(backup, form, odSections, dc);
	}
}

// ####################### Backup using browser localstorage ####################### //

/** persist OD and settings changes over page reload */
function saveLocalBackup(form, odSections, dc) {
	localStorage.etherCATeepromGeneratorBackup = prepareBackupFileContent(form, odSections, dc);
}

function tryRestoreLocalBackup(form, odSections, dc) {
	if (localStorage.etherCATeepromGeneratorBackup)  {
		restoreBackup(localStorage.etherCATeepromGeneratorBackup, form, odSections, dc);
	}	
}

function resetLocalBackup() {
	if (localStorage.etherCATeepromGeneratorBackup) {
		delete localStorage.etherCATeepromGeneratorBackup;
	}
}