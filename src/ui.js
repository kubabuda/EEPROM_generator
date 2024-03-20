/**
 * SOES EEPROM generator
 * UI behavior logic

* This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator
 
 * Victor Sluiter 2013-2018
 * Kuba Buda 2020-2024
 */
'use strict'

// ####################### UI changes handlers ####################### //

function getForm() {
	return document.getElementById("SlaveForm");
}

function getOutputForm() {
	return document.getElementById("outCodeForm");
}

function onFormChanged() {
	const form = getForm();
	processForm(form);
}

/** Shortcuts:
 * Ctrl + S to save project
 * Ctrl + O to load save file
 * Shortcuts start to work after user clicked on page
 */
document.onkeydown = function(e) {
	const S_keyCode = 83;
	const O_keyCode = 79;
	if (e.ctrlKey){
		if (e.keyCode === S_keyCode) {
			e.preventDefault();
			onSaveClick();
			return false;
		}
		else if (e.keyCode == O_keyCode) {
			e.preventDefault();
			onRestoreClick();
			return false;
		}
	}
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == odModal) {
		odModalClose();
	}
}

const odSections = {
	sdo : {},
	txpdo : {}, // addding PDO requires matching SDO in Sync Manager, and PDO mapping
	rxpdo : {}, // this will be done when stitching sections during code generation
};
const _dc = [];

const dtypeDefault = DTYPE.UNSIGNED8 // when adding new item or subitem

window.onload = (event) => {
	odModalSetup();
	syncModalSetup();
	const form = getForm();
	setFormValues(form, getFormDefaultValues());
	tryRestoreLocalBackup(form, odSections, _dc);
	reloadOD_Sections();
	reloadSyncModes();
	// for convinience during tool development, trigger codegen on page refresh
	processForm(form);
	
	const _isComputerFast = automaticCodegen;
	
	if (_isComputerFast) {
		// code is regenerated on every form change. 
		// no need to remember to generate before copying or downloading
		// app is noticeably slower

		processForm(form); // make sure displayed code is up to date at startup, e.g redo, if it came from backup
	
		document.getElementById('GenerateFilesButton').style.display = 'none'; // 'generate' button no longer needed
		form.addEventListener('change', function() {
			onFormChanged();
		});
	}
	setupDarkMode();
}


// ####################### dark mode logic ####################### //
function setupDarkMode() {
	if (!localStorage.darkMode) {
		localStorage.darkMode = 'dark'; // dark mode by default
	}
	document.documentElement.setAttribute("data-theme", localStorage.darkMode);
}

function toggleDarkMode() {
	let newMode = (localStorage.darkMode == 'dark') ? "light" : "dark"
	localStorage.darkMode = newMode;
	document.documentElement.setAttribute("data-theme", localStorage.darkMode);
}

// ####################### code generation  UI logic  ####################### //

/** Code generation method, triggered by UI */
function processForm(form)
{
	const od = buildObjectDictionary(form, odSections);
	const indexes = getUsedIndexes(od);
	const outputCtl = getOutputForm();
	
	outputCtl.objectlist.value = objectlist_generator(form, od, indexes);
	outputCtl.ecat_options.value = ecat_options_generator(form, od, indexes);
	outputCtl.utypes.value = utypes_generator(form, od, indexes);
	outputCtl.HEX.hexData = hex_generator(form);
	outputCtl.HEX.value = toIntelHex(outputCtl.HEX.hexData);
	outputCtl.HEX.header = toEsiEepromH(outputCtl.HEX.hexData);
	outputCtl.ESI.value = esi_generator(form, od, indexes, _dc);
	outputCtl.backupJson = prepareBackupFileContent(form, odSections, _dc);
	
	saveLocalBackup(outputCtl.backupJson);

	return outputCtl;
}

// ####################### Button handlers ####################### //
function getProjectName(form) {
	return variableName(form.TextDeviceName.value);
}

function onGenerateDownloadClick()
{
	const form = getForm();
	const result = processForm(form);
	const projectName = getProjectName(form);
	downloadGeneratedFilesZipped(result, projectName);
}

function onGenerateClick() {
	processForm(getForm());
}

function onSaveClick() {
	const form = getForm();
	const backupJson = prepareBackupFileContent(form, odSections, _dc);
	downloadBackupFile(backupJson);
	saveLocalBackup(backupJson);
}

function onRestoreClick() {
	// if any changes done to app 
	// if (confirm("Loading new project will override existing project. Proceed?")) {
	// trigger file input dialog window
	document.getElementById('restoreFileInput').click();
	// }
}

function onRestoreComplete(fileContent) {
	const form = getForm();
	resetLocalBackup();
	restoreBackup(fileContent, form, odSections, _dc);
	reloadOD_Sections();
	reloadSyncModes();
	processForm(form);
	// location.reload(true);
}

function onResetClick() {
	if (confirm("Are you sure you want to reset project to default values?")){
		resetLocalBackup();
		location.reload(true);
	}
}

function onDownloadEsiXmlClick() {
	const form = getForm();
	const projectName = getProjectName(form);
	downloadFile(getOutputForm().ESI.value, `${projectName}.xml`, 'text/html');
}

function onDownloadBinClick() {
	const record = getOutputForm().HEX.hexData;
	if (!record) { alert("Generate code before you can download it"); return; }
	downloadFile(record, 'eeprom.bin', 'application/octet-stream');
}

// ####################### Handle modal dialog ####################### //

var odModal = {};

function odModalSetup() {
	// Get the modal
	odModal = document.getElementById("editObjectModal");
	if (odModal) {
		odModal.form = document.getElementById('EditObjectForm');
	}
	else {
		alert("Element required to edit Object Dictionary not found!");
	}
}

// When the user clicks the button, open the modal 
function odModalOpen() {
	odModal.style.display = "block";
}

function odModalShowSizeInput(visible=false) {
	document.getElementById('sizeInput').style.display = visible ? '' : 'none';
}

function odModalShowSizeInputForDtype(dtype) {
	odModalShowSizeInput(hasSize(dtype));
}

function odModalIndexChanged(index) {
	odModal.form.Index.value = sanitize0xHexa(index).slice(0, 6);
}

function odModalDTYPEChanged(dtype) {
	odModalShowSizeInputForDtype(dtype);
	odModalInitialValueChanged(odModal.form.InitalValue.value);
}

function odModalInitialValueChanged(value) {
	const dtype = odModal.form.DTYPE.value;
	odModal.form.InitalValue.value = sanitizeInitialValue(value, dtype);
	if (hasSize(dtype) && odModal.form.Size.value < value.length) {
		odModal.form.Size.value = value.length;
	}
}

function getMinimumStringLength(modalform) {
	return modalform.InitalValue.value.length; // + 1 TODO should I add byte for string termination '\0'? check in twincat
}

function odModalSizeInputChanged(value) {
	if (value < 1) {
		odModal.form.Size.value = 1;
		
		if (hasSize(odModal.form.DTYPE.value)) {
			odModal.form.Size.value = getMinimumStringLength(odModal.form);
		}
	}
}

function odModalClose() {
	// TODO clear form 
	odModal.style.display = "none";
	delete odModal.subitem;
	delete odModal.actionName;
}

/** update control values on OD modal */
function odModalUpdate(index, objd) {
	const dtype = objd.dtype || DTYPE.UNSIGNED8; // todo: if not record
	odModal.form.Index.value = `0x${index}`;
	odModal.form.ObjectName.value = objd.name;
	odModal.form.DTYPE.value = dtype;
	odModal.form.InitalValue.value = objd.value || dtype_default_epmty_value[dtype];
	odModal.form.Size.value = objd.size || odModal.form.InitalValue.value.length || 0;
	if (objd.otype == OTYPE.ARRAY) {
		odModal.form.Size.value = objd.items.length - 1;
	}
	odModal.form.Access.value = objd.access || 'RO';
	odModal.objd = objd;
	odModalShowSizeInputForDtype(dtype);
}

function odModalHideControls() {
	document.getElementById('dialogRowIndex').style.display = 'none';
	document.getElementById('dialogRowDtype').style.display = 'none';
	document.getElementById('dialogRowValue').style.display = 'none';
	document.getElementById('sizeInput').style.display = 'none';
	document.getElementById('dialogRowAccess').style.display = 'none';
}

// ####################### Modal dialogs for OD edition ####################### //

function editExistingOD_ObjectDialog(odSectionName, index, otype) {
	const odSection = odSections[odSectionName];
	const objd = odSection[index]; 
	odModal.index_initial_value = index;
	checkObjectType(otype, objd);
	odModalUpdate(index, objd);
}

function addNewOD_ObjectDialog(odSectionName, otype) {
	const objd = getNewObjd(odSections, odSectionName, otype, dtypeDefault);
	const index = getFirstFreeIndex(odSections, odSectionName);
	delete odModal.index_initial_value; // add new object, not replace edited one 
	odModalUpdate(index, objd);
}

function odModalOpenForObject(otype) {
	odModalHideControls();
	document.getElementById('dialogRowIndex').style.display = '';
	document.getElementById('dialogRowAccess').style.display = '';

	switch (otype) {
		case OTYPE.VAR: {
			document.getElementById('dialogRowDtype').style.display = '';
			document.getElementById('dialogRowValue').style.display = '';
			odModalShowSizeInputForDtype(odModal.objd.dtype);
			break;
		}
		case OTYPE.ARRAY: {
			document.getElementById('dialogRowDtype').style.display = "";
			odModalShowSizeInput(true);
			break;		
		}
		case OTYPE.RECORD: {
			break;
		}
		default: { 
			alert(`Unknown object type ${otype}, cannot open modal for it!`);
			return;
		}
	}
	odModalOpen();
	document.getElementById('modalInputIndex').focus();
}

function odModalSetTitle(message) {
	document.getElementById('editObjectTitle').innerHTML = `<strong>${message}</strong>`;
}

// ####################### Edit Object Dictionary UI logic ####################### //

function editVAR_Click(odSectionName, indexValue = null) {
	const otype = OTYPE.VAR;
	const index = indexToString(indexValue);
	let actionName = "Edit";
	odModal.odSectionName = odSectionName;

	if (objectExists(odSections[odSectionName], index)) {
		editExistingOD_ObjectDialog(odSectionName, index, otype);
		odModal.form.DTYPE.value = odModal.objd.dtype;
	} else {
		addNewOD_ObjectDialog(odSectionName, otype);
		actionName = "Add"
	}
	odModalSetTitle(`${actionName} ${odSectionName.toUpperCase()} variable`);
	odModalOpenForObject(otype);
}

function editARRAY_Click(odSectionName, indexValue = null) {
	const otype = OTYPE.ARRAY;
	const index = indexToString(indexValue);
	let actionName = "Edit";
	odModal.odSectionName = odSectionName;
	odModal.form.Access

	if (objectExists(odSections[odSectionName], index)) {
		editExistingOD_ObjectDialog(odSectionName, index, otype);
		odModal.form.DTYPE.value = odModal.objd.dtype;
	} else {
		addNewOD_ObjectDialog(odSectionName, otype);
		actionName = "Add"
	}
	odModalSetTitle(`${actionName} ${odSectionName.toUpperCase()} array`);
	odModalOpenForObject(otype);
}

function editRECORD_Click(odSectionName, indexValue = null) {
	const otype = OTYPE.RECORD;
	const index = indexToString(indexValue);
	let actionName = "Edit";
	odModal.odSectionName = odSectionName;

	if (objectExists(odSections[odSectionName], index)) {
		editExistingOD_ObjectDialog(odSectionName, index, otype);
	} else {
		addNewOD_ObjectDialog(odSectionName, otype);
		actionName = "Add"
	}
	odModalSetTitle(`${actionName} ${odSectionName.toUpperCase()} record`);
	odModalOpenForObject(otype);
}

function onEditObjectSubmit(e) {
	// dummy
	e.preventDefault();
	odModalSaveChanges();
	return false;
}

function validateModalValues(modalform) {
	if (modalform.DTYPE.value == DTYPE.VISIBLE_STRING) {
		const lengthForStringValue = getMinimumStringLength(modalform);
		if (modalform.Size.value < lengthForStringValue) {
			return !confirm(`Initial value needs ${lengthForStringValue} bytes but only ${modalform.Size.value} specified. Proceed anyway?`);
		}
	}
	return true;
}

function sanitizeModalValues(modalform) {
	modalform.ObjectName.value = sanitizeString(modalform.ObjectName.value);
}

function odModalSaveChanges() {
	const modalform = odModal.form;
	if (!validateModalValues(modalform)) {
		return false;
	};
	sanitizeModalValues(modalform);
	
	if (odModal.subitem) {
		onEditSubitemSubmit(odModal.subitem);
		return;
	}
	const objd = odModal.objd;
	const objectType = objd.otype;
	const index = indexToString(modalform.Index.value);
	const newName = modalform.ObjectName.value;

	// validate name changes
	const matchingObjectIndex = findObjectIndexByName(odSections, newName);
	if (matchingObjectIndex && matchingObjectIndex != odModal.index_initial_value) {
		alert(`Name ${newName} already used by object 0x${matchingObjectIndex}`);
		return false;
	}
	objd.name = newName;

	switch (objectType) {
		case OTYPE.VAR:
			objd.dtype = modalform.DTYPE.value;
			objd.value = modalform.InitalValue.value;
			sizeCheckClear(objd, objd.dtype);
			
			if (hasSize(objd.dtype)) {
				objd.size = parseInt(modalform.Size.value);
			} else {
				// validate initial value for numeric type
				if (modalform.InitalValue.value != '0' && isNaN(modalform.InitalValue.value)) {
					alert(`Initial value '${modalform.InitalValue.value}' is invalid for data type ${objd.dtype}`);
					return false;
				}
			}
			
			break;
		case OTYPE.ARRAY:
			objd.dtype = modalform.DTYPE.value;
			setArrayLength(objd, parseInt(modalform.Size.value));
			
			break;
		case OTYPE.RECORD:
		
			break;
		default:
			alert(`Unexpected type ${objectType} on object ${modalform.ObjectName} being edited!`);
			return false;
	}
	
	const odSection = odSections[odModal.odSectionName];

	if (odModal.index_initial_value) {
		removeObject(odSection, odModal.index_initial_value); // detach from OD, to avoid duplicate if index changed
	}
	addObject(odSection, objd, index);	// attach updated object
	odModalClose();
	reloadOD_Section(odModal.odSectionName);
	delete odModal.odSectionName;
	odModal.objd = {};
	
	onFormChanged();
}

function onRemoveClick(odSectionName, indexValue, subindex = null) {
	const index = indexToString(indexValue);
	const odSection = odSections[odSectionName];
	const objd = odSection[index];
	if(!objd) { alert(`${odSectionName.toUpperCase()} object ${index} does not exist!`); return; }

	if(subindex) {
		if(!objd.items) { alert(`Object 0x${index} "${objd.name}" does not have any items!`); return; }
		if(objd.items.length < subindex) { alert(`Object 0x${index} "${objd.name}" does not have enough items!`); return; }
		if(objd.items.length < 3) { // only max subindex and one more subitem
			alert(`Object 0x${index} "${objd.name}" has only 1 subitem, it should not be empty. Remove entire object instead.`); return; }
	}

	if (confirm(getConfirmMessage(objd, index, subindex))) {
		
		if (subindex) {
			const subitemsToRemove = 1;			
			objd.items.splice(subindex, subitemsToRemove); 
		} else {
			removeObject(odSection, index);
		}
		reloadOD_Section(odSectionName);
		onFormChanged();
	}

	function getConfirmMessage(objd, index, subindex) {
		if (subindex) {
			return `Are you sure you want to remove subitem ${subindex} "${objd.items[subindex].name }" from object 0x${index} "${objd.name}"?`
		}
		return `Are you sure you want to remove object 0x${index} "${objd.name}"?`
	}
}

function addSubitemClick(odSectionName, indexValue) {
	const index = indexToString(indexValue);
	const odSection = odSections[odSectionName];
	const objd = odSection[index];
	let subitem;

	// we expect objd to have items array with at least [{ name: 'Max SubIndex' }]
	if(!objd.items || !objd.items.length ) { alert(`Object ${index} "${objd.name}" has no subitems!`); return; }
	switch(objd.otype) {
		case OTYPE.ARRAY: {
			subitem = getNewArraySubitem(objd, objd.dtype || dtypeDefault);
			break;
		}
		case OTYPE.RECORD: {
			subitem = getNewRecordSubitem(objd, dtypeDefault);
			break;
		}
		default: {
			alert(`Object ${index} "${objd.name}" has OTYPE ${objd.otype} so cannot add subitems`);
		}
	}
	const subindex = objd.items.length - 1; // subitem is added to end of items list
	editSubitemClick(odSectionName, indexValue, subindex, "Add", subitem);
}

function editSubitemClick(odSectionName, indexValue, subindex, actionName = "Edit", subitem) {
	const index = indexToString(indexValue);
	const odSection = odSections[odSectionName];
	const objd = odSection[index];
	
	if (subitem == undefined) {
		if(!objd.items || objd.items.length <= subindex ) { alert(`Object ${index} "${objd.name}" does not have ${subindex} subitems!`); return; }
		subitem = objd.items[subindex];
	}
	
	odModalSetTitle(`${actionName} ${odSectionName.toUpperCase()} object 0x${index} "${objd.name}" subitem 0x${indexToString(subindex)}`);
	odModalHideControls();
	
	document.getElementById('dialogRowValue').style.display = "";
	odModal.form.InitalValue.value = subitem.value ?? dtype_default_epmty_value[subitem.dtype];
	
	if (objd.otype == OTYPE.RECORD) {
		document.getElementById('dialogRowDtype').style.display = "";
		odModal.form.DTYPE.value = subitem.dtype;
		document.getElementById('dialogRowAccess').style.display = ''; // access for record subitems can differ
		odModal.form.Access.value = subitem.access || 'RO';
	}
	odModal.form.ObjectName.value = subitem.name;
	odModal.subitem = { odSectionName: odSectionName, index: index, subindex: subindex, subitem: subitem };
	odModal.actionName = actionName;
	odModalOpen();
	document.getElementById('modalInputObjectName').focus();
}

function onEditSubitemSubmit(modalSubitem) {
	const odSection = odSections[modalSubitem.odSectionName];
	const objd = odSection[modalSubitem.index];
	let subindex = modalSubitem.subindex;
	if (odModal.actionName == 'Add') {
		objd.items.push(modalSubitem.subitem);
		subindex++;
	}
	const subitem = objd.items[subindex];
	const newName = odModal.form.ObjectName.value;

	if (!checkIsSubitemNameFree(objd, newName, subindex)) {
		alert(`Name ${newName} already used by another subitem, pick another name`);
		return false;
	}

	subitem.name =  newName;
	subitem.value = odModal.form.InitalValue.value;
	if (objd.otype == OTYPE.RECORD) {
		subitem.dtype = odModal.form.DTYPE.value;
		subitem.access = odModal.form.Access.value;
	}
	odModalClose();
	onFormChanged();
	reloadOD_Section(modalSubitem.odSectionName);
	delete odModal.subitem;
}

// ####################### Display Object Dictionary state ####################### //

function reloadOD_Sections() {
	reloadOD_Section(sdo);
	reloadOD_Section(txpdo);
	reloadOD_Section(rxpdo);
}

function reloadOD_Section(odSectionName) {
	const odSection = odSections[odSectionName];
	const indexes = getUsedIndexes(odSection);
	let section = '';
	indexes.forEach(index => {
		const objd = odSection[index];
		section += `<div class="odItem"><span class="odItemContent"><strong>0x${index}</strong> &nbsp; &nbsp; "${objd.name}" ${objd.otype} ${objd.dtype ?? ''}</span><span>`;
		if (objd.otype == OTYPE.ARRAY || objd.otype == OTYPE.RECORD) {
			section += `<button onClick='addSubitemClick(${odSectionName}, 0x${index})'>&nbsp; ➕ Add subitem &nbsp;</button>`;
		}
		section += `<button onClick='onRemoveClick(${odSectionName}, 0x${index})'>&nbsp; ❌ Remove &nbsp;</button>`;
		section += `<button onClick='edit${objd.otype}_Click(${odSectionName}, 0x${index})'>&nbsp; 🛠️ &nbsp; Edit &nbsp;</button>`;
		section += `</span></div>`;
		if (objd.items) {
			let subindex = 1; // skip Max Subindex
			objd.items.slice(subindex).forEach(subitem => {
				const subindexHex = subindex < 16 ? `0${subindex.toString(16)}` : subindex.toString(16);
				section += `<div class="odSubitem"><span class="odSubitemContent"><strong>:0x${subindexHex}</strong>&nbsp;&nbsp; "${subitem.name}" ${subitem.dtype ?? ''}</span>`;
				section += `<span><button onClick='onRemoveClick(${odSectionName}, 0x${index}, ${subindex})'>&nbsp; ❌ Remove &nbsp;</button>`;
				section += `<button onClick='editSubitemClick(${odSectionName}, 0x${index}, ${subindex})'>&nbsp; 🛠️ &nbsp; Edit &nbsp;</button>`;
				section += `</span></div>`;
				++subindex;
			});
		}
	});
	const odSectionElement = document.getElementById(`tr_${odSectionName}`); 
	if (odSectionElement) {
		odSectionElement.innerHTML = section;
	} 
}

// ####################### Synchronization settings UI ####################### //

var syncModal = {};

function syncModalSetup() {
	// Get the modal
	syncModal = document.getElementById("syncModal");
	if (syncModal) {
		syncModal.form = document.getElementById('syncModalForm');
	}
	else {
		alert("Element required to edit Object Dictionary not found!");
	}
}

function syncModalClose() {
	syncModal.style.display = "none";
	delete syncModal.edited;
	reloadSyncModes();
}

function syncModalOpen() {
	syncModal.style.display = "block";
}

function syncModeEdit(sync) {
	syncModal.edited = sync;

	syncModal.form.Name.value = sync.Name;
	syncModal.form.Description.value = sync.Description;
	syncModal.form.AssignActivate.value = sync.AssignActivate;
	syncModal.form.Sync0cycleTime.value = sync.Sync0cycleTime;
	syncModal.form.Sync0shiftTime.value = sync.Sync0shiftTime;
	syncModal.form.Sync1cycleTime.value = sync.Sync1cycleTime;
	syncModal.form.Sync1shiftTime.value = sync.Sync1shiftTime;

	syncModalOpen();
}

function onSyncSubmit() {
	const syncForm = document.getElementById('syncModalForm');
	if (syncModal.add) {
		// validate synchronization setting name is unique
		for (let dc of _dc) {
			if (dc.Name.toLowerCase() == syncForm.Name.value.toLowerCase()) {
				alert(`Synchronization mode ${dc.Name} already exist, find another name`);
				return false;
			}
		};
		_dc.push(syncModal.edited);
		delete syncModal.add;
	}

	syncModal.edited.Name = syncForm.Name.value;
	syncModal.edited.Description = syncForm.Description.value;
	syncModal.edited.AssignActivate = syncForm.AssignActivate.value;
	syncModal.edited.Sync0cycleTime = syncForm.Sync0cycleTime.value;
	syncModal.edited.Sync0shiftTime = syncForm.Sync0shiftTime.value;
	syncModal.edited.Sync1cycleTime = syncForm.Sync1cycleTime.value;
	syncModal.edited.Sync1shiftTime = syncForm.Sync1shiftTime.value;

	syncModalClose();
	onFormChanged();
}

// ####################### Synchronization settings button handlers ####################### //

function addSyncClick() {
	const newSyncMode = {
		Name: "DcOff",
		Description: "DC unused",
		AssignActivate: "#x000",
		Sync0cycleTime: 0,
		Sync0shiftTime: 0,
		Sync1cycleTime: 0,
		Sync1shiftTime: 0,
	}
	syncModal.add = true;
	syncModeEdit(newSyncMode);
}

function onEditSyncClick(i) {
	const syncMode = _dc[i];
	syncModeEdit(syncMode);
}

function onRemoveSyncClick(i) {
	_dc.splice(i, 1);
	reloadSyncModes();
	onFormChanged();
}

// ####################### Synchronization settings UI ####################### //

function reloadSyncModes() {
	let section = '';
	let i = 0;
	_dc.forEach(sync => {
		section += `<div class="odItem"><span class="odItemContent"><strong>${sync.Name}</strong> &nbsp; &nbsp; ${sync.Description} &nbsp; [${sync.AssignActivate}]</span><span>`;
		section += `<button onClick='onRemoveSyncClick(${i})'>&nbsp; ❌ Remove &nbsp;</button>`;
		section += `<button onClick='onEditSyncClick(${i})'>&nbsp; 🛠️ &nbsp; Edit &nbsp;</button>`;
		section += `</span></div>`;
		++i;
	});
	const sectionElement = document.getElementById(`dcSyncModes`);
	if (sectionElement) {
		sectionElement.innerHTML = section;
	}
}