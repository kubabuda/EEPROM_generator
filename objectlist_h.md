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

From the declarations above we can see that the first member is the subindex, and for an object that is a variable (not an ARRAY or RECORD), the data is stored in subindex 0. The data type is stored in the object, and is indicated by a number (see Table 63 of ETG1000.6). All types have been 'defined' in `objectlist.h`. The bitlength is the length of the data in bits (here calculatad by taking the 'sizeof' which returns size in bytes, and then multiplying by 8). Access should be Readonly according to Table 70, and is set so using the define 'ATYPE_R'. The name of the object points to this declaration above in the file: `_ac acName1009[]="Manufacturer Hardware Version";` value is zero (only used for scalars), and the data points to the hardware version string: `char ac1009_00[]="0.0.1";`. 
