# EEPROM Contents #
When an EtherCAT master is going to communicate with a slave, it will have to know certain basics about the slave node. This basic info is needed to know the mailbox sizes and to know whether the slave supports CoE (CANOpen over EtherCAT) or not. If the slave supports CoE, the master can use CoE mailbox communication to configure the slaves during PreOp, SafeOp and Operational state.
This info should be made available both in an XML-based ESI-file (**E**therCAT **S**lave **I**nformation), and in the EEPROM of the device. **Be sure that the EEPROM, ESI file and source code are using the same data**. You can do this by using [this tool: Generate consistent data in ESI, EEPROM and source](EEPROM_generator.html)

#Writing the EEPROM
To write the EEPROM contents you generated, use [SOEM][SOEM]. 

```
#!bash

     cd test\linux\eepromtool
     sudo .\eepromtool 1 eth0 -wi eeprom.hex
```

[SOEM]:https://developer.berlios.de/projects/soem/