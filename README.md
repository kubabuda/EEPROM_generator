# [🔁 EEPROM generator](https://kubabuda.github.io/EEPROM_generator)

This is basic code generator tool for EtherCAT devices, using [SOES library](https://github.com/OpenEtherCATsociety/SOES).

[It is available online, here](https://kubabuda.github.io/EEPROM_generator)

You can configure:
- ESC (Ethercat Slave Chip) 
- OD (CANopen Object Dictionary) entries
- PDO mappings (which OD objects are mapped in TX, RX datagrams)

Tool generates consistent data across C sources, ESI file and EEPROM content.

It also backs up your current project in localstorage. You can save project to JSON file on your hard drive, restore from it later, and download all files at once.

## Limitations

- Only single, non-dynamic PDO is supported for TX and RX respectively
- Some data types might not be supported

If you need more, [RT-Labs](https://rt-labs.com/ethercat/) offers professional IDE - EtherCAT SDK, and training.

# Development

Pull requests welcome.

Source code is intentionally keept in plain Javascript files so that build system like webpack or even web server is not needed.
The only dependency is web browser, that should future proof it.

## [Unit tests](https://kubabuda.github.io/EEPROM_generator/tests.html)

[Unit tests](https://kubabuda.github.io/EEPROM_generator/tests.html) are using [Jasmine](https://jasmine.github.io). 

## OD structure

OD is keept as JSON object. Expected data format:

```js
{
    '1000': { otype: OTYPE.VAR, dtype: DTYPE.UNSIGNED32, name: 'Device Type', value: 0x1389 },
    '1008': { otype: OTYPE.VAR, dtype: DTYPE.VISIBLE_STRING, name: 'Device Name', data: '' },
    '1009': { otype: OTYPE.VAR, dtype: DTYPE.VISIBLE_STRING, name: 'Hardware Version', data: '' },
    '100A': { otype: OTYPE.VAR, dtype: DTYPE.VISIBLE_STRING, name: 'Software Version', data: '' },
    '1018': { otype: OTYPE.RECORD, name: 'Identity Object', items: [
        { name: 'Max SubIndex' },
        { name: 'Vendor ID', dtype: DTYPE.UNSIGNED32, value: 600 },
        { name: 'Product Code', dtype: DTYPE.UNSIGNED32 },
        { name: 'Revision Number', dtype: DTYPE.UNSIGNED32 },
        { name: 'Serial Number', dtype: DTYPE.UNSIGNED32, data: '&Obj.serial' },
    ]},
    '1C00': { otype: OTYPE.ARRAY, dtype: DTYPE.UNSIGNED8, name: 'Sync Manager Communication Type', items: [
        { name: 'Max SubIndex' },
        { name: 'Communications Type SM0', value: 1 },
        { name: 'Communications Type SM1', value: 2 },
        { name: 'Communications Type SM2', value: 3 },
        { name: 'Communications Type SM3', value: 4 },
    ]},
}   
```

OD model for generator has 4 sections:

- `sdo`, not mapped to PDOs
- `txpdo`, mapped to TXPDO (SM3). Expected format (for OTYPE VAR):
```js
{
    '6000': { otype: OTYPE.VAR, dtype: DTYPE.UNSIGNED32, name: 'TXPDO', value: 0x1389, pdo_mappings: ['tx'] },
}
```
- `rxpdo`, same as above, but `pdo_mappings: ['rx']`
- mandatory objects. These are added at code gen stage, with values populated form UI controls.

Code generation copies all values into single OD, adds PDO mappings and SM assignments. 

## PDO mappings

Currently single, non-dynamic PDO is supported for TX and RX respectively.

## Diff binary files visually in Bash (works in git bash too)

```bash
diff <(xxd et1100.bin) <(xxd lan9252.bin)
```

## Binary file comparison tool for Windows: [VBinDiff](https://www.cjmweb.net/vbindiff/VBinDiff-Win32)

```cmd
VBinDiff et1100.bin  lan9252.bin
```

# Disclaimer

The EtherCAT Technology, the trade name and logo "EtherCAT" are the intellectual
property of, and protected by Beckhoff Automation GmbH.
