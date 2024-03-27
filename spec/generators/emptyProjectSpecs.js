describe("generators", function() {    
  describe("for default, empty project", function() {
    let form;
    let odSections;
    let dc;
    let od;
    let indexes;
    
    beforeEach(function() {
      jasmine.addMatchers(customMatchers);

      form = buildMockFormHelper();
      odSections = getEmptyObjDict();
      dc = [];
      od = buildObjectDictionary(form, odSections);
      indexes = getUsedIndexes(od);
    });
    
    it("esi_generator should generate expected code", function() {
      // arrange
      // act
      const result = esi_generator(form, od, indexes, dc);

      // assert
      const expectedesi = 
`<?xml version="1.0" encoding="UTF-8"?>
<EtherCATInfo>
  <Vendor>
    <Id>0</Id>
    <Name LcId="1033">ACME EtherCAT Devices</Name>
  </Vendor>
  <Descriptions>
    <Groups>
      <Group>
        <Type>DigIn</Type>
        <Name LcId="1033">Digital input</Name>
      </Group>
    </Groups>
    <Devices>
      <Device Physics="YY ">
        <Type ProductCode="#xab123" RevisionNo="#x2">DigIn2000</Type>
        <Name LcId="1033">2-channel Hypergalactic input superimpermanator</Name>
        <GroupType>DigIn</GroupType>
        <Profile>
          <ProfileNo>5001</ProfileNo>
          <AddInfo>0</AddInfo>
          <Dictionary>
            <DataTypes>
              <DataType>
                <Name>DT1018</Name>
                <BitSize>144</BitSize>
                <SubItem>
                  <SubIdx>0</SubIdx>
                  <Name>Max SubIndex</Name>
                  <Type>USINT</Type>
                  <BitSize>8</BitSize>
                  <BitOffs>0</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>1</SubIdx>
                  <Name>Vendor ID</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>2</SubIdx>
                  <Name>Product Code</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>48</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>3</SubIdx>
                  <Name>Revision Number</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>80</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>4</SubIdx>
                  <Name>Serial Number</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>112</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1C00ARR</Name>
                <BaseType>USINT</BaseType>
                <BitSize>32</BitSize>
                <ArrayInfo>
                  <LBound>1</LBound>
                  <Elements>4</Elements>
                </ArrayInfo>
              </DataType>
              <DataType>
                <Name>DT1C00</Name>
                <BitSize>48</BitSize>
                <SubItem>
                  <SubIdx>0</SubIdx>
                  <Name>Max SubIndex</Name>
                  <Type>USINT</Type>
                  <BitSize>8</BitSize>
                  <BitOffs>0</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <Name>Elements</Name>
                  <Type>DT1C00ARR</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>UDINT</Name>
                <BitSize>32</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(47)</Name>
                <BitSize>376</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(5)</Name>
                <BitSize>40</BitSize>
              </DataType>
              <DataType>
                <Name>USINT</Name>
                <BitSize>8</BitSize>
              </DataType>
            </DataTypes>
            <Objects>
              <Object>
                <Index>#x1000</Index>
                <Name>Device Type</Name>
                <Type>UDINT</Type>
                <BitSize>32</BitSize>
                <Info>
                  <DefaultValue>5001</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <Category>m</Category>
                </Flags>
              </Object>
              <Object>
                <Index>#x1008</Index>
                <Name>Device Name</Name>
                <Type>STRING(47)</Type>
                <BitSize>376</BitSize>
                <Info>
                  <DefaultString>2-channel Hypergalactic input superimpermanator</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1009</Index>
                <Name>Hardware Version</Name>
                <Type>STRING(5)</Type>
                <BitSize>40</BitSize>
                <Info>
                  <DefaultString>0.0.1</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <Category>o</Category>
                </Flags>
              </Object>
              <Object>
                <Index>#x100A</Index>
                <Name>Software Version</Name>
                <Type>STRING(5)</Type>
                <BitSize>40</BitSize>
                <Info>
                  <DefaultString>0.0.1</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1018</Index>
                <Name>Identity Object</Name>
                <Type>DT1018</Type>
                <BitSize>144</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Vendor ID</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Product Code</Name>
                    <Info>
                      <DefaultValue>700707</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Revision Number</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Serial Number</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1C00</Index>
                <Name>Sync Manager Communication Type</Name>
                <Type>DT1C00</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM0</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM1</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM2</Name>
                    <Info>
                      <DefaultValue>3</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM3</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
            </Objects>
          </Dictionary>
        </Profile>
        <Fmmu>Outputs</Fmmu>
        <Fmmu>Inputs</Fmmu>
        <Fmmu>MBoxState</Fmmu>
        <Sm DefaultSize="512" StartAddress="#x1000" ControlByte="#x26" Enable="1">MBoxOut</Sm>
        <Sm DefaultSize="512" StartAddress="#x1200" ControlByte="#x22" Enable="1">MBoxIn</Sm>
        <Sm StartAddress="#x1400" ControlByte="#x24" Enable="0">Outputs</Sm>
        <Sm StartAddress="#x1A00" ControlByte="#x20" Enable="0">Inputs</Sm>
        <Mailbox DataLinkLayer="true">
          <CoE SdoInfo="true" PdoAssign="false" PdoConfig="false" PdoUpload="true" CompleteAccess="false" />
        </Mailbox>
        <Eeprom>
          <ByteSize>2048</ByteSize>
          <ConfigData>05060344640000</ConfigData>
        </Eeprom>
      </Device>
    </Devices>
  </Descriptions>
</EtherCATInfo>`;
      expect(result).toEqualLines(expectedesi);
    });

    it("hex_generator should generate config data", function() {
      // arrange
      // act
      const result = hex_generator(form, true);
      
      // assert
      const configData = `05060344640000`;
      expect(result).toEqualLines(configData);
    });

    it("hex_generator should generate EEPROM binary in intel hex format", function() {
      // arrange
      // act
      const result = toIntelHex(hex_generator(form));
      
      // assert
      const eepromBin = 
`:200000000506034464000000000000000000B5000000000023B10A00020000000100000094
:20002000000000000000000000000000000000000010000200120002040000000000000096
:200040000000000000000000000000000000000000000000000000000000000000000000A0
:20006000000000000000000000000000000000000000000000000000000000000F00010070
:200080000A0024000409446967496E3230303005446967496E06494D474342592F322D6316
:2000A00068616E6E656C20487970657267616C616374696320696E707574207375706572CB
:2000C000696D7065726D616E61746F721E00100002030104001300000000000000000000C6
:2000E000110000000000000000000000000000002800020001020300290010000010000274
:200100002600010100120002220001020014000024000103001A000020000104FFFFFFFF7
:20012000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDF
:20014000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBF
:20016000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9F
:20018000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7F
:2001A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5F
:2001C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3F
:2001E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1F
:20020000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE
:20022000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDE
:20024000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBE
:20026000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9E
:20028000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7E
:2002A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5E
:2002C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3E
:2002E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1E
:20030000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD
:20032000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDD
:20034000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBD
:20036000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9D
:20038000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7D
:2003A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D
:2003C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3D
:2003E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1D
:20040000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC
:20042000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDC
:20044000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBC
:20046000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9C
:20048000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7C
:2004A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5C
:2004C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3C
:2004E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1C
:20050000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB
:20052000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDB
:20054000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBB
:20056000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9B
:20058000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7B
:2005A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5B
:2005C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3B
:2005E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1B
:20060000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA
:20062000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDA
:20064000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBA
:20066000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9A
:20068000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7A
:2006A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5A
:2006C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3A
:2006E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1A
:20070000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9
:20072000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD9
:20074000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB9
:20076000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF99
:20078000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF79
:2007A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF59
:2007C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF39
:2007E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF19
:00000001FF`;
      expect(result).toEqualLines(eepromBin);
    });

    it("ecat_options_generator should generate expected code", function() {
      // arrange
      // act
      const result = ecat_options_generator(form, od, indexes);
      
      // assert
      const ecat_options = 
`#ifndef __ECAT_OPTIONS_H__
#define __ECAT_OPTIONS_H__

#define USE_FOE          0
#define USE_EOE          0

#define MBXSIZE          512
#define MBXSIZEBOOT      512
#define MBXBUFFERS       3

#define MBX0_sma         0x1000
#define MBX0_sml         MBXSIZE
#define MBX0_sme         MBX0_sma+MBX0_sml-1
#define MBX0_smc         0x26
#define MBX1_sma         MBX0_sma+MBX0_sml
#define MBX1_sml         MBXSIZE
#define MBX1_sme         MBX1_sma+MBX1_sml-1
#define MBX1_smc         0x22

#define MBX0_sma_b       0x1000
#define MBX0_sml_b       MBXSIZEBOOT
#define MBX0_sme_b       MBX0_sma_b+MBX0_sml_b-1
#define MBX0_smc_b       0x26
#define MBX1_sma_b       MBX0_sma_b+MBX0_sml_b
#define MBX1_sml_b       MBXSIZEBOOT
#define MBX1_sme_b       MBX1_sma_b+MBX1_sml_b-1
#define MBX1_smc_b       0x22

#define SM2_sma          0x1400
#define SM2_smc          0x24
#define SM2_act          1
#define SM3_sma          0x1A00
#define SM3_smc          0x20
#define SM3_act          1

#define MAX_MAPPINGS_SM2 0
#define MAX_MAPPINGS_SM3 0

#define MAX_RXPDO_SIZE   512
#define MAX_TXPDO_SIZE   512

#endif /* __ECAT_OPTIONS_H__ */
`;
      expect(result).toEqualLines(ecat_options);
    });

    it("objectlist_generator should generate expected code", function() {
      // arrange
      // act
      const result = objectlist_generator(form, od, indexes);
      
      // assert
      const objectlist = 
`#include "esc_coe.h"
#include "utypes.h"
#include <stddef.h>


static const char acName1000[] = "Device Type";
static const char acName1008[] = "Device Name";
static const char acName1009[] = "Hardware Version";
static const char acName100A[] = "Software Version";
static const char acName1018[] = "Identity Object";
static const char acName1018_00[] = "Max SubIndex";
static const char acName1018_01[] = "Vendor ID";
static const char acName1018_02[] = "Product Code";
static const char acName1018_03[] = "Revision Number";
static const char acName1018_04[] = "Serial Number";
static const char acName1C00[] = "Sync Manager Communication Type";
static const char acName1C00_00[] = "Max SubIndex";
static const char acName1C00_01[] = "Communications Type SM0";
static const char acName1C00_02[] = "Communications Type SM1";
static const char acName1C00_03[] = "Communications Type SM2";
static const char acName1C00_04[] = "Communications Type SM3";

const _objd SDO1000[] =
{
  {0x0, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1000, 5001, NULL},
};
const _objd SDO1008[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 376, ATYPE_RO, acName1008, 0, "2-channel Hypergalactic input superimpermanator"},
};
const _objd SDO1009[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 40, ATYPE_RO, acName1009, 0, "0.0.1"},
};
const _objd SDO100A[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 40, ATYPE_RO, acName100A, 0, "0.0.1"},
};
const _objd SDO1018[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1018_00, 4, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_01, 0, NULL},
  {0x02, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_02, 700707, NULL},
  {0x03, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_03, 2, NULL},
  {0x04, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_04, 1, &Obj.serial},
};
const _objd SDO1C00[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_00, 4, NULL},
  {0x01, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_01, 1, NULL},
  {0x02, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_02, 2, NULL},
  {0x03, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_03, 3, NULL},
  {0x04, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_04, 4, NULL},
};

const _objectlist SDOobjects[] =
{
  {0x1000, OTYPE_VAR, 0, 0, acName1000, SDO1000},
  {0x1008, OTYPE_VAR, 0, 0, acName1008, SDO1008},
  {0x1009, OTYPE_VAR, 0, 0, acName1009, SDO1009},
  {0x100A, OTYPE_VAR, 0, 0, acName100A, SDO100A},
  {0x1018, OTYPE_RECORD, 4, 0, acName1018, SDO1018},
  {0x1C00, OTYPE_ARRAY, 4, 0, acName1C00, SDO1C00},
  {0xffff, 0xff, 0xff, 0xff, NULL, NULL}
};
`;
      expect(result).toEqualLines(objectlist);
    });

    it("utypes_generator should generate expected code", function() {
      // arrange
      // act
      const result = utypes_generator(form, od, indexes);

      // assert
      const expectedUtypes = 
`#ifndef __UTYPES_H__
#define __UTYPES_H__

#include "cc.h"

/* Object dictionary storage */

typedef struct
{
   /* Identity */

   uint32_t serial;

} _Objects;

extern _Objects Obj;

#endif /* __UTYPES_H__ */
`;
      expect(result).toEqualLines(expectedUtypes);
    });
  });

  describe("for default, empty project restored from localstorage backup", function() {
    const etherCATeepromGeneratorBackup = '{\n  "form": {\n    "VendorName": "ACME EtherCAT Devices",\n    "VendorID": "0x000",\n    "ProductCode": "0x00ab123",\n    "ProfileNo": "5001",\n    "RevisionNumber": "0x002",\n    "SerialNumber": "0x001",\n    "HWversion": "0.0.1",\n    "SWversion": "0.0.1",\n    "EEPROMsize": "2048",\n    "RxMailboxOffset": "0x1000",\n    "TxMailboxOffset": "0x1200",\n    "MailboxSize": "512",\n    "SM2Offset": "0x1400",\n    "SM3Offset": "0x1A00",\n    "TextGroupType": "DigIn",\n    "TextGroupName5": "Digital input",\n    "ImageName": "IMGCBY",\n    "TextDeviceType": "DigIn2000",\n    "TextDeviceName": "2-channel Hypergalactic input superimpermanator",\n    "Port0Physical": "Y",\n    "Port1Physical": "Y",\n    "Port2Physical": " ",\n    "Port3Physical": " ",\n    "ESC": "ET1100",\n    "SPImode": "3",\n    "CoeDetailsEnableSDO": "EnableSDO",\n    "CoeDetailsEnableSDOInfo": "EnableSDOInfo",\n    "CoeDetailsEnablePDOAssign": "EnablePDOAssign",\n    "CoeDetailsEnablePDOConfiguration": "EnablePDOConfiguration",\n    "CoeDetailsEnableUploadAtStartup": "EnableUploadAtStartup",\n    "CoeDetailsEnableSDOCompleteAccess": "EnableSDOCompleteAccess"\n  },\n  "od": {\n    "sdo": {},\n    "txpdo": {},\n    "rxpdo": {}\n  },\n  "dc": []\n}';
    let form;
    let odSections;
    let dc;

    let od;
    let indexes;

    beforeEach(function() {
      jasmine.addMatchers(customMatchers);
      
      form = getEmptyFrom();
      odSections = getEmptyObjDict();
      dc = [];
      
      restoreBackup(etherCATeepromGeneratorBackup, form, odSections, dc);

      od = buildObjectDictionary(form, odSections);
      indexes = getUsedIndexes(od);
    });
      
      it("esi_generator should generate expected code", function() {
        // arrange
        // act
        const result = esi_generator(form, od, indexes, dc);

        // assert
        const expectedesi = 
`<?xml version="1.0" encoding="UTF-8"?>
<EtherCATInfo>
  <Vendor>
    <Id>0</Id>
    <Name LcId="1033">ACME EtherCAT Devices</Name>
  </Vendor>
  <Descriptions>
    <Groups>
      <Group>
        <Type>DigIn</Type>
        <Name LcId="1033">Digital input</Name>
      </Group>
    </Groups>
    <Devices>
      <Device Physics="YY ">
        <Type ProductCode="#xab123" RevisionNo="#x2">DigIn2000</Type>
        <Name LcId="1033">2-channel Hypergalactic input superimpermanator</Name>
        <GroupType>DigIn</GroupType>
        <Profile>
          <ProfileNo>5001</ProfileNo>
          <AddInfo>0</AddInfo>
          <Dictionary>
            <DataTypes>
              <DataType>
                <Name>DT1018</Name>
                <BitSize>144</BitSize>
                <SubItem>
                  <SubIdx>0</SubIdx>
                  <Name>Max SubIndex</Name>
                  <Type>USINT</Type>
                  <BitSize>8</BitSize>
                  <BitOffs>0</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>1</SubIdx>
                  <Name>Vendor ID</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>2</SubIdx>
                  <Name>Product Code</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>48</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>3</SubIdx>
                  <Name>Revision Number</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>80</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>4</SubIdx>
                  <Name>Serial Number</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>112</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1C00ARR</Name>
                <BaseType>USINT</BaseType>
                <BitSize>32</BitSize>
                <ArrayInfo>
                  <LBound>1</LBound>
                  <Elements>4</Elements>
                </ArrayInfo>
              </DataType>
              <DataType>
                <Name>DT1C00</Name>
                <BitSize>48</BitSize>
                <SubItem>
                  <SubIdx>0</SubIdx>
                  <Name>Max SubIndex</Name>
                  <Type>USINT</Type>
                  <BitSize>8</BitSize>
                  <BitOffs>0</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <Name>Elements</Name>
                  <Type>DT1C00ARR</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>UDINT</Name>
                <BitSize>32</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(47)</Name>
                <BitSize>376</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(5)</Name>
                <BitSize>40</BitSize>
              </DataType>
              <DataType>
                <Name>USINT</Name>
                <BitSize>8</BitSize>
              </DataType>
            </DataTypes>
            <Objects>
              <Object>
                <Index>#x1000</Index>
                <Name>Device Type</Name>
                <Type>UDINT</Type>
                <BitSize>32</BitSize>
                <Info>
                  <DefaultValue>5001</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <Category>m</Category>
                </Flags>
              </Object>
              <Object>
                <Index>#x1008</Index>
                <Name>Device Name</Name>
                <Type>STRING(47)</Type>
                <BitSize>376</BitSize>
                <Info>
                  <DefaultString>2-channel Hypergalactic input superimpermanator</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1009</Index>
                <Name>Hardware Version</Name>
                <Type>STRING(5)</Type>
                <BitSize>40</BitSize>
                <Info>
                  <DefaultString>0.0.1</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <Category>o</Category>
                </Flags>
              </Object>
              <Object>
                <Index>#x100A</Index>
                <Name>Software Version</Name>
                <Type>STRING(5)</Type>
                <BitSize>40</BitSize>
                <Info>
                  <DefaultString>0.0.1</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1018</Index>
                <Name>Identity Object</Name>
                <Type>DT1018</Type>
                <BitSize>144</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Vendor ID</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Product Code</Name>
                    <Info>
                      <DefaultValue>700707</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Revision Number</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Serial Number</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1C00</Index>
                <Name>Sync Manager Communication Type</Name>
                <Type>DT1C00</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM0</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM1</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM2</Name>
                    <Info>
                      <DefaultValue>3</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM3</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
            </Objects>
          </Dictionary>
        </Profile>
        <Fmmu>Outputs</Fmmu>
        <Fmmu>Inputs</Fmmu>
        <Fmmu>MBoxState</Fmmu>
        <Sm DefaultSize="512" StartAddress="#x1000" ControlByte="#x26" Enable="1">MBoxOut</Sm>
        <Sm DefaultSize="512" StartAddress="#x1200" ControlByte="#x22" Enable="1">MBoxIn</Sm>
        <Sm StartAddress="#x1400" ControlByte="#x24" Enable="0">Outputs</Sm>
        <Sm StartAddress="#x1A00" ControlByte="#x20" Enable="0">Inputs</Sm>
        <Mailbox DataLinkLayer="true">
          <CoE SdoInfo="false" PdoAssign="false" PdoConfig="false" PdoUpload="false" CompleteAccess="false" />
        </Mailbox>
        <Eeprom>
          <ByteSize>2048</ByteSize>
          <ConfigData>05060344640000</ConfigData>
        </Eeprom>
      </Device>
    </Devices>
  </Descriptions>
</EtherCATInfo>`;
        expect(result).toEqualLines(expectedesi);
      });

      it("hex_generator should generate config string when given extra parameter true", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `05060344640000`;
        expect(result).toEqual(configData);
      });

      it("hex_generator should generate EEPROM binary in intel hex format", function() {
        // arrange
        // act
        const result = toIntelHex(hex_generator(form));
        
        // assert
        const eepromBin = 
`:200000000506034464000000000000000000B5000000000023B10A00020000000100000094
:20002000000000000000000000000000000000000010000200120002040000000000000096
:200040000000000000000000000000000000000000000000000000000000000000000000A0
:20006000000000000000000000000000000000000000000000000000000000000F00010070
:200080000A0024000409446967496E3230303005446967496E06494D474342592F322D6316
:2000A00068616E6E656C20487970657267616C616374696320696E707574207375706572CB
:2000C000696D7065726D616E61746F721E00100002030104000000000000000000000000D9
:2000E000110000000000000000000000000000002800020001020300290010000010000274
:200100002600010100120002220001020014000024000103001A000020000104FFFFFFFF7
:20012000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDF
:20014000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBF
:20016000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9F
:20018000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7F
:2001A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5F
:2001C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3F
:2001E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1F
:20020000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE
:20022000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDE
:20024000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBE
:20026000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9E
:20028000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7E
:2002A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5E
:2002C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3E
:2002E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1E
:20030000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD
:20032000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDD
:20034000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBD
:20036000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9D
:20038000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7D
:2003A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D
:2003C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3D
:2003E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1D
:20040000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC
:20042000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDC
:20044000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBC
:20046000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9C
:20048000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7C
:2004A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5C
:2004C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3C
:2004E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1C
:20050000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB
:20052000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDB
:20054000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBB
:20056000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9B
:20058000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7B
:2005A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5B
:2005C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3B
:2005E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1B
:20060000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA
:20062000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDA
:20064000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBA
:20066000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9A
:20068000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7A
:2006A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5A
:2006C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF3A
:2006E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1A
:20070000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9
:20072000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD9
:20074000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFB9
:20076000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF99
:20078000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF79
:2007A000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF59
:2007C000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF39
:2007E000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF19
:00000001FF`;
        expect(result).toEqualLines(eepromBin);
      });

      it("ecat_options_generator should generate expected code", function() {
        // arrange
        // act
        const result = ecat_options_generator(form, od, indexes);
        
        // assert
        const ecat_options = 
`#ifndef __ECAT_OPTIONS_H__
#define __ECAT_OPTIONS_H__

#define USE_FOE          0
#define USE_EOE          0

#define MBXSIZE          512
#define MBXSIZEBOOT      512
#define MBXBUFFERS       3

#define MBX0_sma         0x1000
#define MBX0_sml         MBXSIZE
#define MBX0_sme         MBX0_sma+MBX0_sml-1
#define MBX0_smc         0x26
#define MBX1_sma         MBX0_sma+MBX0_sml
#define MBX1_sml         MBXSIZE
#define MBX1_sme         MBX1_sma+MBX1_sml-1
#define MBX1_smc         0x22

#define MBX0_sma_b       0x1000
#define MBX0_sml_b       MBXSIZEBOOT
#define MBX0_sme_b       MBX0_sma_b+MBX0_sml_b-1
#define MBX0_smc_b       0x26
#define MBX1_sma_b       MBX0_sma_b+MBX0_sml_b
#define MBX1_sml_b       MBXSIZEBOOT
#define MBX1_sme_b       MBX1_sma_b+MBX1_sml_b-1
#define MBX1_smc_b       0x22

#define SM2_sma          0x1400
#define SM2_smc          0x24
#define SM2_act          1
#define SM3_sma          0x1A00
#define SM3_smc          0x20
#define SM3_act          1

#define MAX_MAPPINGS_SM2 0
#define MAX_MAPPINGS_SM3 0

#define MAX_RXPDO_SIZE   512
#define MAX_TXPDO_SIZE   512

#endif /* __ECAT_OPTIONS_H__ */
`;
          expect(result).toEqualLines(ecat_options);
      });

      it("objectlist_generator should generate expected code", function() {
        // arrange
        // act
        const result = objectlist_generator(form, od, indexes);
        
        // assert
        const objectlist = 
`#include "esc_coe.h"
#include "utypes.h"
#include <stddef.h>


static const char acName1000[] = "Device Type";
static const char acName1008[] = "Device Name";
static const char acName1009[] = "Hardware Version";
static const char acName100A[] = "Software Version";
static const char acName1018[] = "Identity Object";
static const char acName1018_00[] = "Max SubIndex";
static const char acName1018_01[] = "Vendor ID";
static const char acName1018_02[] = "Product Code";
static const char acName1018_03[] = "Revision Number";
static const char acName1018_04[] = "Serial Number";
static const char acName1C00[] = "Sync Manager Communication Type";
static const char acName1C00_00[] = "Max SubIndex";
static const char acName1C00_01[] = "Communications Type SM0";
static const char acName1C00_02[] = "Communications Type SM1";
static const char acName1C00_03[] = "Communications Type SM2";
static const char acName1C00_04[] = "Communications Type SM3";

const _objd SDO1000[] =
{
  {0x0, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1000, 5001, NULL},
};
const _objd SDO1008[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 376, ATYPE_RO, acName1008, 0, "2-channel Hypergalactic input superimpermanator"},
};
const _objd SDO1009[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 40, ATYPE_RO, acName1009, 0, "0.0.1"},
};
const _objd SDO100A[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 40, ATYPE_RO, acName100A, 0, "0.0.1"},
};
const _objd SDO1018[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1018_00, 4, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_01, 0, NULL},
  {0x02, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_02, 700707, NULL},
  {0x03, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_03, 2, NULL},
  {0x04, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_04, 1, &Obj.serial},
};
const _objd SDO1C00[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_00, 4, NULL},
  {0x01, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_01, 1, NULL},
  {0x02, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_02, 2, NULL},
  {0x03, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_03, 3, NULL},
  {0x04, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_04, 4, NULL},
};

const _objectlist SDOobjects[] =
{
  {0x1000, OTYPE_VAR, 0, 0, acName1000, SDO1000},
  {0x1008, OTYPE_VAR, 0, 0, acName1008, SDO1008},
  {0x1009, OTYPE_VAR, 0, 0, acName1009, SDO1009},
  {0x100A, OTYPE_VAR, 0, 0, acName100A, SDO100A},
  {0x1018, OTYPE_RECORD, 4, 0, acName1018, SDO1018},
  {0x1C00, OTYPE_ARRAY, 4, 0, acName1C00, SDO1C00},
  {0xffff, 0xff, 0xff, 0xff, NULL, NULL}
};
`;
      expect(result).toEqualLines(objectlist);
    });

    it("utypes_generator should generate expected code", function() {
      // arrange
      // act
      const result = utypes_generator(form, od, indexes);

      // assert
      const expectedUtypes = 
`#ifndef __UTYPES_H__
#define __UTYPES_H__

#include "cc.h"

/* Object dictionary storage */

typedef struct
{
   /* Identity */

   uint32_t serial;

} _Objects;

extern _Objects Obj;

#endif /* __UTYPES_H__ */
`;
      expect(result).toEqualLines(expectedUtypes);
    });

    describe("when restored form checks are not overwritten with default settings", function() {
      const etherCATeepromGeneratorBackup = '{\n  "form": {\n    "VendorName": "ACME EtherCAT Devices",\n    "VendorID": "0x000",\n    "ProductCode": "0x00ab123",\n    "ProfileNo": "5001",\n    "RevisionNumber": "0x002",\n    "SerialNumber": "0x001",\n    "HWversion": "0.0.1",\n    "SWversion": "0.0.1",\n    "EEPROMsize": "2048",\n    "RxMailboxOffset": "0x1000",\n    "TxMailboxOffset": "0x1200",\n    "MailboxSize": "512",\n    "SM2Offset": "0x1400",\n    "SM3Offset": "0x1A00",\n    "TextGroupType": "DigIn",\n    "TextGroupName5": "Digital input",\n    "ImageName": "IMGCBY",\n    "TextDeviceType": "DigIn2000",\n    "TextDeviceName": "2-channel Hypergalactic input superimpermanator",\n    "Port0Physical": "Y",\n    "Port1Physical": "Y",\n    "Port2Physical": " ",\n    "Port3Physical": " ",\n    "ESC": "ET1100",\n    "SPImode": "3",\n    "CoeDetailsEnableSDO": "EnableSDO",\n    "CoeDetailsEnableSDOInfo": "EnableSDOInfo",\n    "CoeDetailsEnablePDOAssign": "EnablePDOAssign",\n    "CoeDetailsEnablePDOConfiguration": "EnablePDOConfiguration",\n    "CoeDetailsEnableUploadAtStartup": "EnableUploadAtStartup",\n    "CoeDetailsEnableSDOCompleteAccess": "EnableSDOCompleteAccess"\n  },\n  "od": {\n    "sdo": {},\n    "txpdo": {},\n    "rxpdo": {}\n  },\n  "dc": []\n}';
      let form;
      let odSections;        
      let dc;

      let od;
      let indexes;
      
      beforeEach(function() {
        jasmine.addMatchers(customMatchers);
      
        form = getEmptyFrom();
        odSections = getEmptyObjDict();
        dc = [];
      
        setFormValues(form, getFormDefaultValues());
        restoreBackup(etherCATeepromGeneratorBackup, form, odSections,  dc);
        od = buildObjectDictionary(form, odSections);
        indexes = getUsedIndexes(od);
      });
        
      it("esi_generator should generate expected code", function() {
        // arrange
        // act
        const result = esi_generator(form, od, indexes, dc);

        // assert
        const expectedesi = 
`<?xml version="1.0" encoding="UTF-8"?>
<EtherCATInfo>
  <Vendor>
    <Id>0</Id>
    <Name LcId="1033">ACME EtherCAT Devices</Name>
  </Vendor>
  <Descriptions>
    <Groups>
      <Group>
        <Type>DigIn</Type>
        <Name LcId="1033">Digital input</Name>
      </Group>
    </Groups>
    <Devices>
      <Device Physics="YY ">
        <Type ProductCode="#xab123" RevisionNo="#x2">DigIn2000</Type>
        <Name LcId="1033">2-channel Hypergalactic input superimpermanator</Name>
        <GroupType>DigIn</GroupType>
        <Profile>
          <ProfileNo>5001</ProfileNo>
          <AddInfo>0</AddInfo>
          <Dictionary>
            <DataTypes>
              <DataType>
                <Name>DT1018</Name>
                <BitSize>144</BitSize>
                <SubItem>
                  <SubIdx>0</SubIdx>
                  <Name>Max SubIndex</Name>
                  <Type>USINT</Type>
                  <BitSize>8</BitSize>
                  <BitOffs>0</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>1</SubIdx>
                  <Name>Vendor ID</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>2</SubIdx>
                  <Name>Product Code</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>48</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>3</SubIdx>
                  <Name>Revision Number</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>80</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>4</SubIdx>
                  <Name>Serial Number</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>112</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1C00ARR</Name>
                <BaseType>USINT</BaseType>
                <BitSize>32</BitSize>
                <ArrayInfo>
                  <LBound>1</LBound>
                  <Elements>4</Elements>
                </ArrayInfo>
              </DataType>
              <DataType>
                <Name>DT1C00</Name>
                <BitSize>48</BitSize>
                <SubItem>
                  <SubIdx>0</SubIdx>
                  <Name>Max SubIndex</Name>
                  <Type>USINT</Type>
                  <BitSize>8</BitSize>
                  <BitOffs>0</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <Name>Elements</Name>
                  <Type>DT1C00ARR</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>UDINT</Name>
                <BitSize>32</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(47)</Name>
                <BitSize>376</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(5)</Name>
                <BitSize>40</BitSize>
              </DataType>
              <DataType>
                <Name>USINT</Name>
                <BitSize>8</BitSize>
              </DataType>
            </DataTypes>
            <Objects>
              <Object>
                <Index>#x1000</Index>
                <Name>Device Type</Name>
                <Type>UDINT</Type>
                <BitSize>32</BitSize>
                <Info>
                  <DefaultValue>5001</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <Category>m</Category>
                </Flags>
              </Object>
              <Object>
                <Index>#x1008</Index>
                <Name>Device Name</Name>
                <Type>STRING(47)</Type>
                <BitSize>376</BitSize>
                <Info>
                  <DefaultString>2-channel Hypergalactic input superimpermanator</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1009</Index>
                <Name>Hardware Version</Name>
                <Type>STRING(5)</Type>
                <BitSize>40</BitSize>
                <Info>
                  <DefaultString>0.0.1</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <Category>o</Category>
                </Flags>
              </Object>
              <Object>
                <Index>#x100A</Index>
                <Name>Software Version</Name>
                <Type>STRING(5)</Type>
                <BitSize>40</BitSize>
                <Info>
                  <DefaultString>0.0.1</DefaultString>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1018</Index>
                <Name>Identity Object</Name>
                <Type>DT1018</Type>
                <BitSize>144</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Vendor ID</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Product Code</Name>
                    <Info>
                      <DefaultValue>700707</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Revision Number</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Serial Number</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1C00</Index>
                <Name>Sync Manager Communication Type</Name>
                <Type>DT1C00</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM0</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM1</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM2</Name>
                    <Info>
                      <DefaultValue>3</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Communications Type SM3</Name>
                    <Info>
                      <DefaultValue>4</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
            </Objects>
          </Dictionary>
        </Profile>
        <Fmmu>Outputs</Fmmu>
        <Fmmu>Inputs</Fmmu>
        <Fmmu>MBoxState</Fmmu>
        <Sm DefaultSize="512" StartAddress="#x1000" ControlByte="#x26" Enable="1">MBoxOut</Sm>
        <Sm DefaultSize="512" StartAddress="#x1200" ControlByte="#x22" Enable="1">MBoxIn</Sm>
        <Sm StartAddress="#x1400" ControlByte="#x24" Enable="0">Outputs</Sm>
        <Sm StartAddress="#x1A00" ControlByte="#x20" Enable="0">Inputs</Sm>
        <Mailbox DataLinkLayer="true">
          <CoE SdoInfo="false" PdoAssign="false" PdoConfig="false" PdoUpload="false" CompleteAccess="false" />
        </Mailbox>
        <Eeprom>
          <ByteSize>2048</ByteSize>
          <ConfigData>05060344640000</ConfigData>
        </Eeprom>
      </Device>
    </Devices>
  </Descriptions>
</EtherCATInfo>`;
        expect(result).toEqualLines(expectedesi);
      });
    });
  });
});
