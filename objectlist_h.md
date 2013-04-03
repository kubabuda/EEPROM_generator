# What is in `objectlist.h` ?
Objectlist is the place where all CoE objects are defined. To get a good understanding of what happens here please start reading about CANOpen first, and keep ETG1000.6 (EtherCAT specification, Application Layer) at hand. Also ETG5001 comes in handy here, as it describes the default indexes for several categories of devices and offers a good overview of 'standardized' indexes. 

# CANOpen, CoE
CANOpen uses 'indexes' (32-bit) and subindexes (8-bit) to identify CANOpen objects. An object as it is used here mostly contains a number. 
When the EtherCAT slave is in PreOP it enables 
