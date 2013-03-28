# EEPROM Contents #
When an EtherCAT master is going to communicate with a slave, it will have to know certain basics about the slave node. This basic info is needed to know the mailbox sizes and to know whether the slave supports CoE (CANOpen over EtherCAT) or not. If the slave supports CoE, the master can use CoE mailbox communication to configure the slaves during PreOp, SafeOp and Operational state.
This info should be made available both in an XML-based ESI-file (**E**therCAT **S**lave **I**nformation), and in the EEPROM of the device. **Be sure that the EEPROM, ESI file and source code are using the same data**.  

[EEPROM_generator.html]
When the EtherCAT Slave Controller (ESC) starts up, it is in Init state, and no information can be exchanged between the EtherCAT Master and the microcontroller connected to the ESC. The master will first figure out what kind of slave is attached, and will then try to get the slave to go to SafeOP state.


