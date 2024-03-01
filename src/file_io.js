/**
 * SOES EEPROM generator
 * Files input and output

 * This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2024
 */
'use strict'

// ####################### File operations ####################### //

/** save file in local filesystem, by downloading from browser */
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
	// a element will be garbage collected, no need to cleanup
}

/** reads saved project from file user opened */
function readFile(e) {
	const file = e.target.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = function(e) {
		onRestoreComplete(e.target.result);
  	}
	reader.readAsText(file);
}
