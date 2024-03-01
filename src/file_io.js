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

function downloadGeneratedFilesZipped(result, projectName) {
	const zip = new JSZip();
	zip.file(`${projectName}.xml`, result.ESI.value);
	zip.file('eeprom.hex', result.HEX.value);
	zip.file('eeprom.bin', result.HEX.hexData);
	zip.file('ecat_options.h', result.ecat_options.value);
	zip.file('objectlist.c', result.objectlist.value);
	zip.file('utypes.h', result.utypes.value);
	zip.file('esi.json', result.backupJson);

	zip.generateAsync({type:"blob"}).then(function (blob) { // generate the zip file
		downloadFile(blob, "esi.zip", "application/zip"); // trigger the download
	}, function (err) {
		console.log(err);
	});
}

function downloadGeneratedFiles(result, projectName) {
	downloadFile(result.ESI.value, `${projectName}.xml`, 'text/html');
	downloadFile(result.HEX.value, 'eeprom.hex', 'application/octet-stream');
	downloadFile(result.ecat_options.value, 'ecat_options.h', 'text/plain');
	downloadFile(result.objectlist.value, 'objectlist.c', 'text/plain');
	downloadFile(result.utypes.value, 'utypes.h', 'text/plain');
	downloadBackupFile(result.backupJson);
}