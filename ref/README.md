# Binary file comparison: [VBinDiff](https://www.cjmweb.net/vbindiff/VBinDiff-Win32)

```cmd
VBinDiff ref/et1100.bin  ref/lan9252.bin
```

# Config Data

<ConfigData>05060344640000</ConfigData> gen
<ConfigData>0502030000000000</ConfigData> start
<ConfigData>050403440a00000000001a000000</ConfigData> AX
<ConfigData>050603446400000000001A000000</ConfigData>

# MIME types

https://www.sitepoint.com/mime-types-complete-list/

# OD 

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


# TODO

- check generated XML for PDOs
- add subitem edition on ARR, RECORD objects
- use [dl](https://www.w3schools.com/html/tryit.asp?filename=tryhtml_lists_description) to display it
- merging OD sections for ARR, RECORDs
- add PDO variable types to utypes.h
- adding PDO with mappings, types et al
- check generated C, XML code
- check .bin output
- make .bin generation work for 256B EEPROM (for now fails < 512B)
- test if code compilation works
- test on real HW
- make GUI look better
- add favicon
### Code optimization
- reuse repeated string constants in objlist.c names, test if does any good or compiler does that for you anyway
- shrink to fit on AVR ATmega
