/**
 * SOES EEPROM generator
 * ESI XML reader

 * This tool serves as:
- EtherCAT Slave Information XML + EEPROM binary generator
- SOES code generator

 * Kuba Buda 2024
 */
'use strict'

// ####################### Backup serialization + deserialization ####################### //

/** Takes ESI XML as string, returns restored from */
function xml_reader(xml_text, esc) {
    const result = { form: {}, od: { sdo: {}, rxpdo: {}, txpdo: {} }, dc: [] };
    result.form.ESC = esc;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml_text, "text/xml");
    // debugger;
    const EtherCATInfo = xmlDoc.getElementsByTagName("EtherCATInfo")[0]
    
    const Vendor = EtherCATInfo.getElementsByTagName('Vendor')[0];
    result.form.VendorName = Vendor.getElementsByTagName('Name')[0].innerHTML;
    result.form.VendorID = toHex(Vendor.getElementsByTagName('Id')[0].innerHTML);
    
    const Groups = EtherCATInfo.getElementsByTagName('Groups')[0];
    const Group = Groups.getElementsByTagName('Group')[0];
    result.form.TextGroupType = Group.getElementsByTagName('Type')[0].innerHTML
    result.form.TextGroupName5 = Group.getElementsByTagName('Name')[0].innerHTML
    
    const Devices = EtherCATInfo.getElementsByTagName('Devices')[0];
    const Device = Devices.getElementsByTagName('Device')[0];
    
    const DeviceType = Device.getElementsByTagName('Type')[0];
    result.form.TextDeviceType = DeviceType.innerHTML
    result.form.ProductCode = toJsHex(DeviceType.attributes['ProductCode'].value);
    result.form.RevisionNumber = toJsHex(DeviceType.attributes['RevisionNo'].value);
    if (!result.form.TextDeviceType) {
        result.form.TextDeviceType = Device.getElementsByTagGroupType('GroupType')[0].innerHTML;
    }

    result.form.TextDeviceName = Device.getElementsByTagName('Name')[0].innerHTML;
    
    addDeviceProfile(Device, result);
    
    const DeviceFmmu = Device.getElementsByTagName('Fmmu');
    const DeviceSm = Device.getElementsByTagName('Sm');
    const DeviceRxPdo = Device.getElementsByTagName('RxPdo');
    const DeviceTxPdo = Device.getElementsByTagName('TxPdo');

    addDeviceMailbox(Device, result);
    // debugger;

    const DeviceDc = Device.getElementsByTagName('Dc');
    
    addDeviceEEPROM(Device, result);
    
    
    return result;

    function addDeviceEEPROM(Device, result) {
        const DeviceEeprom = Device.getElementsByTagName('Eeprom')[0];
        result.form.EEPROMsize = DeviceEeprom.getElementsByTagName('ByteSize')[0].innerHTML;
        const ConfigData = DeviceEeprom.getElementsByTagName('ConfigData')[0].innerHTML;
        // TODO read SPI mode etc from EEPROM ConfigData
        result.form.SPImode = '0';
    }

    function addDeviceProfile(Device, result) {
        const DeviceProfile = Device.getElementsByTagName('Profile')[0];
        result.form.ProfileNo = DeviceProfile.getElementsByTagName('ProfileNo')[0].innerHTML;
        
        const DeviceProfileDictionary = DeviceProfile.getElementsByTagName('Dictionary')[0];   
        const DeviceProfileDictionaryDataTypes = DeviceProfileDictionary.getElementsByTagName('DataTypes')[0];
        const DeviceProfileDictionaryObjects = DeviceProfileDictionary.getElementsByTagName('Objects')[0];
        /** TODO read OD */
    }

    function addDeviceMailbox(Device, result) {
        const DeviceMailbox = Device.getElementsByTagName('Mailbox')[0];
        const DeviceMailboxCoE = DeviceMailbox.getElementsByTagName('CoE')[0];
        if (DeviceMailboxCoE) {

            result.form.CoeDetailsEnableSDO = true;
            result.form.CoeDetailsEnableSDOInfo = DeviceMailboxCoE.attributes['SdoInfo'].value == 'true';
            result.form.CoeDetailsEnablePDOAssign = DeviceMailboxCoE.attributes['PdoAssign'].value == 'true';
            result.form.CoeDetailsEnablePDOConfiguration = DeviceMailboxCoE.attributes['PdoConfig'].value == 'true';
            result.form.CoeDetailsEnablePdoUploadAtStartup = DeviceMailboxCoE.attributes['PdoUpload'].value == 'true';
            result.form.CoeDetailsEnableSDOCompleteAccess = DeviceMailboxCoE.attributes['CompleteAccess'].value == 'true';
        }
    }

    /** takes ESI.xml hex value and return in JS hex format
     *  #x1F -> 0x1F */
    function toJsHex(str) {
        if (str.toLowerCase().startsWith('#')) {
            str = `${str.slice(1)}`;
        }
        if (str.toLowerCase().startsWith('x')) {
            str = `0${str}`;
        }
        return toHex(str);
    }
    
    function toHex(str) {
        return `0x${parseInt(str).toString(16)}`;
    }
}
