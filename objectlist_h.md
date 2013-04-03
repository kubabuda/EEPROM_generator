# What is in `objectlist.h` ?
Objectlist is the place where all CoE objects are defined. To get a good understanding of what happens here please start reading about CANOpen first, and keep ETG1000.6 (EtherCAT specification, Application Layer) at hand. Chapter 5.6.7 describes the object dictionary structure and shows how data should be encoded. SOES handles this encoding by using `struct`s and arrays, but having a basic understanding of the way this is mapped in the application layer will help in understanding internal dependencies of these structures. Also, ETG5001 comes in handy here, as it describes the default indexes for several categories of devices and offers a good overview of 'standardized' indexes. 

# CANOpen, CoE
CANOpen uses 'indexes' (16-bit) and subindexes (8-bit) to identify CANOpen objects. The notation of indexes and subindexes is hexadecimal, with a semicolon separating the index and subindex. For example, the Vendor ID is stored in object 1018:01 (As described in 5.6.7.4.6 of ETG1000.6). This is object 0x1018 with subindex 1, and holds an Unsigned 32-bit number.  Objects can hold a single variable, but also an 'ARRAY' (where each subindex of the main index holds a variable) or a 'RECORD', where each subindex holds a reference to another object (index and subindex).
For EtherCAT, CoE communication (CANOpen over EtherCAT) is a very important way of communicating. It is used in a mailbox protocol (where master and slave know from each other whether sent messages have been received) to exchange settings, and to create a very versatile mapping of data. This is not the place to explain all possibilities of this protocol, so I won't do that.... What is important to know is that in the already mentioned paragraph 5.6.7 of ETG1000.6 the objects used in `objectlist.h` are described in more detail.

# Changing objects, which dependancies?
When changing objects in `objlist.h' you have to be very careful to maintain consistent data across all objects. Somebody fancy writing a tool for this? If you're doing it wrong, the code will compile, but the master or configurator won't be able to get the correct information from your slave, and this will result in very messy behaviour starting (end mostly ending) in the PreOP state, when mailbox communication is enabled.

## Explanation of objects
I'm going to start with a very simple object, the 'hardware version":
```
#!c
const _objd SDO1009[]=
{{0x00,DTYPE_VISIBLE_STRING,sizeof(ac1009_00)<<3,ATYPE_R,&acName1009[0],0,&ac1009_00[0]}};
```
This is a `const` array of '_objd' variables, called SDO1009. In ETG1000.6:5.6.7.4 (Table 70) we see that Object 1009 is a 'VAR' of type 'VisibleString'. Each object in `objectlist.h` is described as a struct of type `_objd`:
```
#!c
typedef const struct
  {
    uint16        subindex;
    uint16        datatype;
    uint16        bitlength;
    uint16        access;
    char   const *name;
    uint32        value;
    void          *data;
  } _objd;
```

From the declarations above we can see that the first member is the subindex, and for an object that is a variable (not an ARRAY or RECORD), the data is stored in subindex 0. The data type is stored in the object, and is indicated by a number (see Table 63 of ETG1000.6). All data types have been 'defined' in `objectlist.h`. The bitlength is the length of the data in bits (here calculatad by taking the 'sizeof' which returns size in bytes, and then multiplying by 8). Access should be Readonly according to Table 70, and is set so using the define 'ATYPE_R'. The name of the object points to this declaration above in the file: `_ac acName1009[]="Manufacturer Hardware Version";` value is zero (only used for scalars), and the data points to the hardware version string: `char ac1009_00[]="0.0.1";`. In general, this describes the structure of a variable holding a single variable. ** Use the index value in the definition of the string with the description (and possibly the string with value) when you create a new object **

### A bit more complicated; CANOpen ARRAY object.
An array is 'simply' an array of 'VAR' objects, with subindex 0 telling how many entries are listed:
```
#!c
const _objd SDO1C13[]=                                              //TxPDO Assign objects ; CHANGEABLE, thus 'RWpre' mode
{{0x00,DTYPE_UNSIGNED8,8,ATYPE_RWpre,&acNameNOE[0],0x02},               //Number of Entries
  {0x01,DTYPE_UNSIGNED16,16,ATYPE_RWpre,&acNameMO[0],0x1A00},            //Send objects in index 0x1A00
  {0x02,DTYPE_UNSIGNED16,16,ATYPE_RWpre,&acNameMO[0],0x1A10}             //Send objects in index 0x1A10
};
```
This is SDO1C13, the Receive PDO mapping. In short, this object is an array of indexes to objects that can be sent from the slave to the master using the TxPDO communication (Syncmanager exchanges data between EtherCAT datagrams and local buffer. Data can be overwritten. This is using CANOpen objects to create settings for non-mailbox communication....).
You can see that subindex 0 holds the amount of of subindexes (0x02), and that the subindexes themselves increase.

** When adding or removing a subindex, change both the subindex self (first item in rule) AND the value at the end of subindex 0 **
Also, do mind that the data size is descibed *twice* in each subindex above: both in the data type (`DTYPE_UNSIGNED16`) and as bitlength 16. 
** Be very careful about data types when adding / changing values! **

### A level further: RECORDS
A record looks a lot like an array, but holds references to other indexes and subindexes
```
#!c
const _objd SDO1A00[]=                                              //TxPDO mapping (objects from slave to master)
{{0x00,DTYPE_UNSIGNED8,8,ATYPE_R,&acNameNOE[0],0x03},               //Number of TxPDOs
  {0x01,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60000108},       //First Object, pointing to object  6000:01
  {0x02,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60000208},       //Second Object, pointing to object 6000:02
  {0x03,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60000308}       //..
};
const _objd SDO1A10[]=                                              //Second TxPDO module
{{0x00,DTYPE_UNSIGNED8,8,ATYPE_R,&acNameNOE[0],0x09},
  {0x01,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010110},
  {0x02,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010210},
  {0x03,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010310},
  {0x04,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010410},
  {0x05,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010510},
  {0x06,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010610},
  {0x07,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010710},
  {0x08,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010810},
  {0x09,DTYPE_UNSIGNED32,32,ATYPE_R,&acNameMO[0],0x60010920}
};
```
Here you can see the RECORDs the ARRAY above pointed to. Each subindex in the record points to a variable that will be sent over TxPDO. Again, subindexes should be increasing, and the amount of subindexes (<0) and the 'value' in subindex 0 should be in accordance. The value of each item in a record is combined out of 'index'+'subindex'+'bitlength of VAR'. For example: 0x60010610-> index 6001, subindex 06, 0x10 bits (16bit). Let's take a look at object 6001:
```
#!c
const _objd SDO6001[]=                                                      //TxPDO module
{{0x00,DTYPE_UNSIGNED8  ,8,ATYPE_R,&acNameNOE[0],0x09},                     //Number of elements
  {0x01,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_01[0],0,&(Rb.analog[0])},  //6001:1 is analog 0
  {0x02,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_02[0],0,&(Rb.analog[1])},  //6001:2 is analog 1
  {0x03,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_03[0],0,&(Rb.analog[2])},  //6001:3 is analog 2
  {0x04,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_04[0],0,&(Rb.analog[3])},  //6001:4 is analog 3
  {0x05,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_05[0],0,&(Rb.analog[4])},  //6001:5 is analog 4
  {0x06,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_06[0],0,&(Rb.analog[5])},  //6001:6 is analog 5
  {0x07,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_07[0],0,&(Rb.analog[6])},  //6001:7 is analog 6
  {0x08,DTYPE_INTEGER16  ,16,ATYPE_R,&acName6001_08[0],0,&(Rb.analog[7])},  //6001:8 is analog 7
  {0x09,DTYPE_UNSIGNED32 ,32,ATYPE_R,&acName6001_09[0],0,&(Rb.timestamp)}   //6001:9 is timestamp
};
```
As you can see, 6001:6 is a 16-bit number. Bingo! You can also see that the timestamp is 32-bit, both in 6001:09 and in 1A10:09! The subindexes of bothe 6001 and 1A10 are equal in this case, but this isn't necessarily so.

** When working with records, the size of a variable is stored in 3 locations: twice in the variable, once in the record. Keep these synchronised! **

#### Recap on objects
We've seen an array (SDO1C13) pointing to two records (SDO1A00 and SDO1A10), with each of these records holding indexes to variables in other array objects (SDO6000 and SDO6001). This is about as complicated and nested as it gets with CoE. Please spend some time investigating the CoE mailbox protocols to control the slaves (slides on ETG website). Once you understand why this gives a lot of modularity and control over data, you'll start to see why this is such a good and  well thought-of system.
The implementation of these objects in SOES is quite transparent, but should be handled carefully to keep all variables consistent. Now that you're this far, you'll get the last stage:

# The Objectlist ITSELF!
To keep track of all Slave objects,`objectlist.h` ends with a list that describes all objects used in the slave.
** When adding objects, don't forget to add them to the SDOobjects[] array! **

Here is its definition:
```
#!c
const _objectlist SDOobjects[]=
{{0x1000,OTYPE_VAR     , 0,0,&acName1000[0],&SDO1000[0]},       //Device Type
  {0x1008,OTYPE_VAR     , 0,0,&acName1008[0],&SDO1008[0]},      //Device Name
  {0x1009,OTYPE_VAR     , 0,0,&acName1009[0],&SDO1009[0]},      //Hardware Version
  {0x100A,OTYPE_VAR     , 0,0,&acName100A[0],&SDO100A[0]},      //Software Version
  {0x1018,OTYPE_RECORD  , 4,0,&acName1018[0],&SDO1018[0]},      //Identity
  {0x1600,OTYPE_RECORD  , 0x02,0,&acName1600[0],&SDO1600[0]},   //RxPDO mapping
  {0x1A00,OTYPE_RECORD  , 0x03,0,&acName1A00[0],&SDO1A00[0]},   //TxPDO mapping
  {0x1A10,OTYPE_RECORD  , 0x09,0,&acName1A10[0],&SDO1A10[0]},   //TxPDO mapping
  {0x1C00,OTYPE_ARRAY   , 4,0,&acName1C00[0],&SDO1C00[0]},      //Sync Manager configuration
  {0x1C10,OTYPE_ARRAY   , 0,0,&acName1C10[0],&SDO1C10[0]},      //Sync Manager 0 PDO assignment
  {0x1C11,OTYPE_ARRAY   , 0,0,&acName1C11[0],&SDO1C11[0]},      //Sync Manager 1 PDO assignment
  {0x1C12,OTYPE_ARRAY   , 1,0,&acName1C12[0],&SDO1C12[0]},      //RxPDO objects
  {0x1C13,OTYPE_ARRAY   , 2,0,&acName1C13[0],&SDO1C13[0]},      //TxPDO objects
  {0x6000,OTYPE_ARRAY   , 0x03,0,&acName6000[0],&SDO6000[0]},   //TxPDO module
  {0x6001,OTYPE_ARRAY   , 0x09,0,&acName6001[0],&SDO6001[0]},   //TxPDO module
  {0x7000,OTYPE_ARRAY   , 0x02,0,&acName7000[0],&SDO7000[0]},   //RxPDO module
  {0x8000,OTYPE_ARRAY   , 0x02,0,&acName8000[0],&SDO8000[0]},   //RxPDO module
  {0xffff,0xff,0xff,0xff,nil,nil}
};
```
Here you see that all objects are listed neatly, and in this list the coupling is made between the index and the corresponding object.
** SDOobjects[] sets the index and type (VAR, RECORD, ARRAY) of each object **
** VERY CAREFUL! When adding subindexes to objects, ALSO change the number of subindexes in SDOobjects[]!!! ***

Happy hacking!

