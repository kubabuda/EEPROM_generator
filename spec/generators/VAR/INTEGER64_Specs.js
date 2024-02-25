describe("OTYPE VAR", function() {
  describe("DTYPE INT8", function() {
    describe("for default empty project with INT8 as TXPDO", function() {
      let form;
      let odSections;
      let od;
      let indexes;
      
      beforeEach(function() {
        form = buildMockFormHelper();
        odSections = getEmptyObjDict();
        od = buildObjectDictionary(form, odSections);
        od['6000'] = {
          otype: "VAR",
          name: "Count",
          access: "RO",
          pdo_mappings: [
            "txpdo",
          ],
          dtype: "INTEGER64",
          value: "42",
          data: "&Obj.Count",
        };
        indexes = getUsedIndexes(od);
      });
      
      it("esi_generator should generate expected code", function() {
        // arrange
        const dc = [];
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
              <DataType>
                <Name>LINT</Name>
                <BitSize>64</BitSize>
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
              <Object>
                <Index>#x6000</Index>
                <Name>Count</Name>
                <Type>LINT</Type>
                <BitSize>64</BitSize>
                <Info>
                  <DefaultValue>42</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <PdoMapping>T</PdoMapping>
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
        <Sm StartAddress="#x1600" ControlByte="#x24" Enable="0">Outputs</Sm>
        <Sm StartAddress="#x1A00" ControlByte="#x20" Enable="1">Inputs</Sm>
        <TxPdo Fixed="true" Mandatory="true" Sm="3">
          <Index>#x1A00</Index>
          <Name>Count</Name>
          <Entry>
            <Index>#x6000</Index>
            <SubIndex>#x0</SubIndex>
            <BitLen>64</BitLen>
            <Name>Count</Name>
            <DataType>LINT</DataType>
          </Entry>
        </TxPdo>
        <Mailbox DataLinkLayer="true">
          <CoE SdoInfo="true" PdoAssign="false" PdoConfig="false" PdoUpload="true" CompleteAccess="false" />
        </Mailbox>
        <Dc>
        </Dc>
        <Eeprom>
          <ByteSize>2048</ByteSize>
          <ConfigData>05060344640000</ConfigData>
        </Eeprom>
      </Device>
    </Devices>
  </Descriptions>
</EtherCATInfo>`;
        expect(result).toEqual(expectedesi);
      });

      it("hex_generator should generate config data", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `05060344640000`;
        expect(result).toEqual(configData);
      });

      it("ecat_options_generator should generate config data", function() {
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

#define SM2_sma          0x1600
#define SM2_smc          0x24
#define SM2_act          1
#define SM3_sma          0x1A00
#define SM3_smc          0x20
#define SM3_act          1

#define MAX_MAPPINGS_SM2 0
#define MAX_MAPPINGS_SM3 1

#define MAX_RXPDO_SIZE   512
#define MAX_TXPDO_SIZE   512

#endif /* __ECAT_OPTIONS_H__ */
`;
        expect(result).toEqual(ecat_options);
      });

      it("objectlist_generator should generate config data", function() {
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
static const char acName6000[] = "Count";

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
const _objd SDO6000[] =
{
  {0x0, DTYPE_INTEGER64, 64, ATYPE_RO | ATYPE_TXPDO, acName6000, 42, &Obj.Count},
};

const _objectlist SDOobjects[] =
{
  {0x1000, OTYPE_VAR, 0, 0, acName1000, SDO1000},
  {0x1008, OTYPE_VAR, 0, 0, acName1008, SDO1008},
  {0x1009, OTYPE_VAR, 0, 0, acName1009, SDO1009},
  {0x100A, OTYPE_VAR, 0, 0, acName100A, SDO100A},
  {0x1018, OTYPE_RECORD, 4, 0, acName1018, SDO1018},
  {0x1C00, OTYPE_ARRAY, 4, 0, acName1C00, SDO1C00},
  {0x6000, OTYPE_VAR, 0, 0, acName6000, SDO6000},
  {0xffff, 0xff, 0xff, 0xff, NULL, NULL}
};
`;
        expect(result).toEqual(objectlist);
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

   /* Inputs */

   int64_t Count;

} _Objects;

extern _Objects Obj;

#endif /* __UTYPES_H__ */
`;
        expect(result).toEqual(expectedUtypes);
      });
    });
  });
});
