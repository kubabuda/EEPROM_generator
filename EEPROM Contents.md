# EEPROM Contents #
When an EtherCAT master is going to communicate with a slave, it will have to know certain basics about the slave node. This basic info is needed to know things like the mailbox sizes and to know which mailbox protocols are supported. If the slave supports CoE, the master can use CoE mailbox communication to configure the slaves during PreOp, SafeOp and Operational state.
The EEPROM also stores Hardware and Software version, Vendor ID and product code. All this info can be used by the master to determine whether the device is suitable for its intended purpose.
This info should be made available both in an XML-based ESI-file (**E**therCAT **S**lave **I**nformation), and in the EEPROM of the device. 


**Be sure that the EEPROM, ESI file and source code are using the same data. You can do this by using [this tool: Generate consistent data in ESI, EEPROM and source](https://bravoembedded.bitbucket.io/EEPROM_generator.html)**

#Writing the EEPROM
To write the EEPROM contents you generated, use [SOEM][SOEM]. 

```
#!bash

     cd test/linux/eepromtool
     sudo ./eepromtool 1 eth0 -wi eeprom.hex
```

[SOEM]:http://openethercatsociety.github.io/