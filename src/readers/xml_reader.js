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
    // debugger;
    result.form.ProductCode = maybeHex(DeviceType.attributes['ProductCode'].value);
    result.form.TextDeviceName = Device.getElementsByTagName('Name')[0].innerHTML;
    // DeviceGroupType = Device.getElementsByTagGroupType('GroupType')[0].innerHTML;
    const DeviceProfile = Device.getElementsByTagName('Profile')[0];
    result.form.ProfileNo = DeviceProfile.getElementsByTagName('ProfileNo')[0].innerHTML;

    return result;

    function maybeHex(str) {
        if (str.toLowerCase().startsWith('#')) {
            str = `${str.slice(1)}`;
        }
        if (str.toLowerCase().startsWith('x')) {
            str = `0${str}`;
        }
        return str;
    }
    
    function toHex(str) {
        return `0x${parseInt(str).toString(16)}`;
    }
}
