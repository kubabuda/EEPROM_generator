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
function xml_reader(xml_text) {
    const result = { form: {}, od: { sdo: {}, rxpdo: {}, txpdo: {} }, dc: [] };
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml_text, "text/xml");
    // debugger;
    const vendor = xmlDoc.getElementsByTagName("EtherCATInfo")[0].getElementsByTagName('Vendor')[0];
    result.form.VendorName = vendor.getElementsByTagName('Name')[0].innerHTML;
    result.form.VendorID = toHex(vendor.getElementsByTagName('Id')[0].innerHTML);
    // debugger;

    return result;

    function toHex(str) {
        return `0x${parseInt(str).toString(16)}`;
    }
}
