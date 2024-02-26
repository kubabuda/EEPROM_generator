const cia_esi_json = `{
  "form": {
    "VendorName": "kubabuda",
    "VendorID": "0x1337",
    "ProductCode": "0x20192",
    "ProfileNo": "402",
    "RevisionNumber": "0x001",
    "SerialNumber": "0x001",
    "HWversion": "0.0.1",
    "SWversion": "0.0.1",
    "EEPROMsize": "2048",
    "RxMailboxOffset": "0x1000",
    "TxMailboxOffset": "0x1200",
    "MailboxSize": "512",
    "SM2Offset": "0x1600",
    "SM3Offset": "0x1A00",
    "TextGroupType": "Servodrives",
    "TextGroupName5": "CiA402-compatible",
    "ImageName": "IMGCBY",
    "TextDeviceType": "AC servodrive",
    "TextDeviceName": "STMBL ECAT",
    "Port0Physical": "Y",
    "Port1Physical": "Y",
    "Port2Physical": " ",
    "Port3Physical": " ",
    "ESC": "AX58100",
    "SPImode": "0",
    "CoeDetailsEnableSDO": true,
    "CoeDetailsEnableSDOInfo": true,
    "CoeDetailsEnablePDOAssign": false,
    "CoeDetailsEnablePDOConfiguration": false,
    "CoeDetailsEnableUploadAtStartup": true,
    "CoeDetailsEnableSDOCompleteAccess": false
  },
  "od": {
    "sdo": {
      "1001": {
        "otype": "VAR",
        "name": "Error register",
        "access": "RO",
        "dtype": "UNSIGNED8",
        "value": "0",
        "isSDOitem": true,
        "data": "&Obj.Error_register"
      },
      "6060": {
        "otype": "VAR",
        "name": "Modes of operation",
        "access": "RO",
        "dtype": "INTEGER8",
        "value": "0",
        "isSDOitem": true,
        "data": "&Obj.Modes_of_operation"
      },
      "6061": {
        "otype": "VAR",
        "name": "Mode of operation display",
        "access": "RO",
        "dtype": "INTEGER8",
        "value": "0",
        "isSDOitem": true,
        "data": "&Obj.Mode_of_operation_display"
      },
      "6502": {
        "otype": "VAR",
        "name": "Supported drive modes",
        "access": "RO",
        "dtype": "UNSIGNED32",
        "value": "0",
        "isSDOitem": true,
        "data": "&Obj.Supported_drive_modes"
      },
      "1C32": {
        "otype": "RECORD",
        "name": "Sync Manager 2 Parameters",
        "access": "RO",
        "items": [
          {
            "name": "Max SubIndex"
          },
          {
            "name": "Sync mode",
            "dtype": "UNSIGNED16",
            "value": "1",
            "access": "RWpre",
            "data": "&Obj.Sync_Manager_2_Parameters.Sync_mode"
          },
          {
            "name": "CycleTime",
            "dtype": "UNSIGNED32",
            "value": "0",
            "data": "&Obj.Sync_Manager_2_Parameters.CycleTime"
          },
          {
            "name": "ShiftTime",
            "dtype": "UNSIGNED32",
            "value": "0",
            "data": "&Obj.Sync_Manager_2_Parameters.ShiftTime"
          },
          {
            "name": "Sync modes supported",
            "dtype": "UNSIGNED16",
            "value": "6",
            "data": "&Obj.Sync_Manager_2_Parameters.Sync_modes_supported"
          },
          {
            "name": "Minimum Cycle Time",
            "dtype": "UNSIGNED32",
            "value": "125000",
            "data": "&Obj.Sync_Manager_2_Parameters.Minimum_Cycle_Time"
          }
        ],
        "isSDOitem": true
      },
      "A": {
        "otype": "RECORD",
        "name": "Error Settings",
        "access": "RO",
        "items": [
          {
            "name": "Max SubIndex"
          },
          {
            "name": "New record subitem",
            "dtype": "UNSIGNED8"
          }
        ]
      },
      "10F1": {
        "otype": "RECORD",
        "name": "Error Settings",
        "access": "RO",
        "items": [
          {
            "name": "Max SubIndex"
          },
          {
            "name": "Local Error Reaction",
            "dtype": "UNSIGNED32",
            "data": "&Obj.Error_Settings.Local_Error_Reaction",
            "value": "0",
            "access": "RO"
          },
          {
            "name": "SyncErrorCounterLimit",
            "dtype": "UNSIGNED32",
            "value": "200",
            "access": "RO",
            "data": "&Obj.Error_Settings.SyncErrorCounterLimit"
          }
        ],
        "isSDOitem": true
      },
      "1C33": {
        "otype": "RECORD",
        "name": "Sync Manager 3 Parameters",
        "access": "RO",
        "items": [
          {
            "name": "Max SubIndex"
          },
          {
            "name": "Sync mode",
            "dtype": "UNSIGNED16",
            "data": "&Obj.Sync_Manager_3_Parameters.Sync_mode",
            "value": "1",
            "access": "RWpre"
          },
          {
            "name": "CycleTime",
            "dtype": "UNSIGNED32",
            "value": "0",
            "access": "RO",
            "data": "&Obj.Sync_Manager_3_Parameters.CycleTime"
          },
          {
            "name": "ShiftTime",
            "dtype": "UNSIGNED32",
            "value": "0",
            "access": "RO",
            "data": "&Obj.Sync_Manager_3_Parameters.ShiftTime"
          },
          {
            "name": "Sync modes supported",
            "dtype": "UNSIGNED16",
            "value": "6",
            "access": "RO",
            "data": "&Obj.Sync_Manager_3_Parameters.Sync_modes_supported"
          },
          {
            "name": "Minimum Cycle Time",
            "dtype": "UNSIGNED32",
            "value": "125000",
            "access": "RO",
            "data": "&Obj.Sync_Manager_3_Parameters.Minimum_Cycle_Time"
          }
        ],
        "isSDOitem": true
      }
    },
    "txpdo": {
      "6041": {
        "otype": "VAR",
        "name": "Status Word",
        "access": "RO",
        "pdo_mappings": [
          "txpdo"
        ],
        "dtype": "UNSIGNED16",
        "value": "0",
        "data": "&Obj.Status_Word"
      },
      "6064": {
        "otype": "VAR",
        "name": "Position actual",
        "access": "RO",
        "pdo_mappings": [
          "txpdo"
        ],
        "dtype": "UNSIGNED32",
        "value": "0",
        "data": "&Obj.Position_actual"
      }
    },
    "rxpdo": {
      "6040": {
        "otype": "VAR",
        "name": "Control Word",
        "access": "RO",
        "pdo_mappings": [
          "rxpdo"
        ],
        "dtype": "UNSIGNED16",
        "value": "0",
        "data": "&Obj.Control_Word"
      },
      "607A": {
        "otype": "VAR",
        "name": "Target position",
        "access": "RO",
        "pdo_mappings": [
          "rxpdo"
        ],
        "dtype": "UNSIGNED32",
        "value": "0",
        "data": "&Obj.Target_position"
      }
    }
  },
  "dc": [
    {
      "Name": "SM-Synchron",
      "Description": "SM-Synchron",
      "AssignActivate": "#x000",
      "Sync0cycleTime": "0",
      "Sync0shiftTime": "0",
      "Sync1cycleTime": "0",
      "Sync1shiftTime": "0"
    },
    {
      "Name": "DC",
      "Description": "DC-Synchron",
      "AssignActivate": "#x300",
      "Sync0cycleTime": "0",
      "Sync0shiftTime": "0",
      "Sync1cycleTime": "0",
      "Sync1shiftTime": "0"
    }
  ]
}`;

describe("generators", function() {
  describe("for example CiA 402 CSP application", function() {
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

      restoreBackup(cia_esi_json, form, odSections, dc);
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
    <Id>4919</Id>
    <Name LcId="1033">kubabuda</Name>
  </Vendor>
  <Descriptions>
    <Groups>
      <Group>
        <Type>Servodrives</Type>
        <Name LcId="1033">CiA402-compatible</Name>
      </Group>
    </Groups>
    <Devices>
      <Device Physics="YY ">
        <Type ProductCode="#x20192" RevisionNo="#x1">AC servodrive</Type>
        <Name LcId="1033">STMBL ECAT</Name>
        <GroupType>Servodrives</GroupType>
        <Profile>
          <ProfileNo>402</ProfileNo>
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
                <Name>DT10F1</Name>
                <BitSize>80</BitSize>
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
                  <Name>Local Error Reaction</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>2</SubIdx>
                  <Name>SyncErrorCounterLimit</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>48</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1600</Name>
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
                  <SubIdx>1</SubIdx>
                  <Name>Control Word</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1601</Name>
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
                  <SubIdx>1</SubIdx>
                  <Name>Target position</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1A00</Name>
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
                  <SubIdx>1</SubIdx>
                  <Name>Status Word</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1A01</Name>
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
                  <SubIdx>1</SubIdx>
                  <Name>Position actual</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
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
                <Name>DT1C12ARR</Name>
                <BaseType>UINT</BaseType>
                <BitSize>32</BitSize>
                <ArrayInfo>
                  <LBound>1</LBound>
                  <Elements>2</Elements>
                </ArrayInfo>
              </DataType>
              <DataType>
                <Name>DT1C12</Name>
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
                  <Type>DT1C12ARR</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1C13ARR</Name>
                <BaseType>UINT</BaseType>
                <BitSize>32</BitSize>
                <ArrayInfo>
                  <LBound>1</LBound>
                  <Elements>2</Elements>
                </ArrayInfo>
              </DataType>
              <DataType>
                <Name>DT1C13</Name>
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
                  <Type>DT1C13ARR</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1C32</Name>
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
                  <Name>Sync mode</Name>
                  <Type>UINT</Type>
                  <BitSize>16</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">rw</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>2</SubIdx>
                  <Name>CycleTime</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>32</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>3</SubIdx>
                  <Name>ShiftTime</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>64</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>4</SubIdx>
                  <Name>Sync modes supported</Name>
                  <Type>UINT</Type>
                  <BitSize>16</BitSize>
                  <BitOffs>96</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>5</SubIdx>
                  <Name>Minimum Cycle Time</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>112</BitOffs>
                  <Flags>
                    <Access>ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>DT1C33</Name>
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
                  <Name>Sync mode</Name>
                  <Type>UINT</Type>
                  <BitSize>16</BitSize>
                  <BitOffs>16</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">rw</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>2</SubIdx>
                  <Name>CycleTime</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>32</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>3</SubIdx>
                  <Name>ShiftTime</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>64</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>4</SubIdx>
                  <Name>Sync modes supported</Name>
                  <Type>UINT</Type>
                  <BitSize>16</BitSize>
                  <BitOffs>96</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">ro</Access>
                  </Flags>
                </SubItem>
                <SubItem>
                  <SubIdx>5</SubIdx>
                  <Name>Minimum Cycle Time</Name>
                  <Type>UDINT</Type>
                  <BitSize>32</BitSize>
                  <BitOffs>112</BitOffs>
                  <Flags>
                    <Access WriteRestrictions="PreOP">ro</Access>
                  </Flags>
                </SubItem>
              </DataType>
              <DataType>
                <Name>UDINT</Name>
                <BitSize>32</BitSize>
              </DataType>
              <DataType>
                <Name>USINT</Name>
                <BitSize>8</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(10)</Name>
                <BitSize>80</BitSize>
              </DataType>
              <DataType>
                <Name>STRING(5)</Name>
                <BitSize>40</BitSize>
              </DataType>
              <DataType>
                <Name>UINT</Name>
                <BitSize>16</BitSize>
              </DataType>
              <DataType>
                <Name>SINT</Name>
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
                <Index>#x1001</Index>
                <Name>Error register</Name>
                <Type>USINT</Type>
                <BitSize>8</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1008</Index>
                <Name>Device Name</Name>
                <Type>STRING(10)</Type>
                <BitSize>80</BitSize>
                <Info>
                  <DefaultString>STMBL ECAT</DefaultString>
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
                      <DefaultValue>4919</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Product Code</Name>
                    <Info>
                      <DefaultValue>131474</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Revision Number</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
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
                <Index>#x10F1</Index>
                <Name>Error Settings</Name>
                <Type>DT10F1</Type>
                <BitSize>80</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Local Error Reaction</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>SyncErrorCounterLimit</Name>
                    <Info>
                      <DefaultValue>200</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1600</Index>
                <Name>Control Word</Name>
                <Type>DT1600</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Control Word</Name>
                    <Info>
                      <DefaultValue>#x60400010</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1601</Index>
                <Name>Target position</Name>
                <Type>DT1601</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Target position</Name>
                    <Info>
                      <DefaultValue>#x607A0020</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1A00</Index>
                <Name>Status Word</Name>
                <Type>DT1A00</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Status Word</Name>
                    <Info>
                      <DefaultValue>#x60410010</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1A01</Index>
                <Name>Position actual</Name>
                <Type>DT1A01</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Position actual</Name>
                    <Info>
                      <DefaultValue>#x60640020</DefaultValue>
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
                <Index>#x1C12</Index>
                <Name>Sync Manager 2 PDO Assignment</Name>
                <Type>DT1C12</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>PDO Mapping</Name>
                    <Info>
                      <DefaultValue>#x1600</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>PDO Mapping</Name>
                    <Info>
                      <DefaultValue>#x1601</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1C13</Index>
                <Name>Sync Manager 3 PDO Assignment</Name>
                <Type>DT1C13</Type>
                <BitSize>48</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>2</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>PDO Mapping</Name>
                    <Info>
                      <DefaultValue>#x1A00</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>PDO Mapping</Name>
                    <Info>
                      <DefaultValue>#x1A01</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1C32</Index>
                <Name>Sync Manager 2 Parameters</Name>
                <Type>DT1C32</Type>
                <BitSize>144</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>5</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Sync mode</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>CycleTime</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>ShiftTime</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Sync modes supported</Name>
                    <Info>
                      <DefaultValue>6</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Minimum Cycle Time</Name>
                    <Info>
                      <DefaultValue>125000</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x1C33</Index>
                <Name>Sync Manager 3 Parameters</Name>
                <Type>DT1C33</Type>
                <BitSize>144</BitSize>
                <Info>
                  <SubItem>
                    <Name>Max SubIndex</Name>
                    <Info>
                      <DefaultValue>5</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Sync mode</Name>
                    <Info>
                      <DefaultValue>1</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>CycleTime</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>ShiftTime</Name>
                    <Info>
                      <DefaultValue>0</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Sync modes supported</Name>
                    <Info>
                      <DefaultValue>6</DefaultValue>
                    </Info>
                  </SubItem>
                  <SubItem>
                    <Name>Minimum Cycle Time</Name>
                    <Info>
                      <DefaultValue>125000</DefaultValue>
                    </Info>
                  </SubItem>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x6040</Index>
                <Name>Control Word</Name>
                <Type>UINT</Type>
                <BitSize>16</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <PdoMapping>R</PdoMapping>
                </Flags>
              </Object>
              <Object>
                <Index>#x6041</Index>
                <Name>Status Word</Name>
                <Type>UINT</Type>
                <BitSize>16</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <PdoMapping>T</PdoMapping>
                </Flags>
              </Object>
              <Object>
                <Index>#x6060</Index>
                <Name>Modes of operation</Name>
                <Type>SINT</Type>
                <BitSize>8</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x6061</Index>
                <Name>Mode of operation display</Name>
                <Type>SINT</Type>
                <BitSize>8</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                </Flags>
              </Object>
              <Object>
                <Index>#x6064</Index>
                <Name>Position actual</Name>
                <Type>UDINT</Type>
                <BitSize>32</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <PdoMapping>T</PdoMapping>
                </Flags>
              </Object>
              <Object>
                <Index>#x607A</Index>
                <Name>Target position</Name>
                <Type>UDINT</Type>
                <BitSize>32</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
                </Info>
                <Flags>
                  <Access>ro</Access>
                  <PdoMapping>R</PdoMapping>
                </Flags>
              </Object>
              <Object>
                <Index>#x6502</Index>
                <Name>Supported drive modes</Name>
                <Type>UDINT</Type>
                <BitSize>32</BitSize>
                <Info>
                  <DefaultValue>0</DefaultValue>
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
        <Sm StartAddress="#x1600" ControlByte="#x24" Enable="1">Outputs</Sm>
        <Sm StartAddress="#x1A00" ControlByte="#x20" Enable="1">Inputs</Sm>
        <RxPdo Fixed="true" Mandatory="true" Sm="2">
          <Index>#x1600</Index>
          <Name>Control Word</Name>
          <Entry>
            <Index>#x6040</Index>
            <SubIndex>#x0</SubIndex>
            <BitLen>16</BitLen>
            <Name>Control Word</Name>
            <DataType>UINT</DataType>
          </Entry>
        </RxPdo>
        <RxPdo Fixed="true" Mandatory="true" Sm="2">
          <Index>#x1601</Index>
          <Name>Target position</Name>
          <Entry>
            <Index>#x607A</Index>
            <SubIndex>#x0</SubIndex>
            <BitLen>32</BitLen>
            <Name>Target position</Name>
            <DataType>UDINT</DataType>
          </Entry>
        </RxPdo>
        <TxPdo Fixed="true" Mandatory="true" Sm="3">
          <Index>#x1A00</Index>
          <Name>Status Word</Name>
          <Entry>
            <Index>#x6041</Index>
            <SubIndex>#x0</SubIndex>
            <BitLen>16</BitLen>
            <Name>Status Word</Name>
            <DataType>UINT</DataType>
          </Entry>
        </TxPdo>
        <TxPdo Fixed="true" Mandatory="true" Sm="3">
          <Index>#x1A01</Index>
          <Name>Position actual</Name>
          <Entry>
            <Index>#x6064</Index>
            <SubIndex>#x0</SubIndex>
            <BitLen>32</BitLen>
            <Name>Position actual</Name>
            <DataType>UDINT</DataType>
          </Entry>
        </TxPdo>
        <Mailbox DataLinkLayer="true">
          <CoE SdoInfo="true" PdoAssign="false" PdoConfig="false" PdoUpload="true" CompleteAccess="false" />
        </Mailbox>
        <Dc>
          <OpMode>
            <Name>SM-Synchron</Name>
            <Desc>SM-Synchron</Desc>
            <AssignActivate>#x000</AssignActivate>
          </OpMode>
          <OpMode>
            <Name>DC</Name>
            <Desc>DC-Synchron</Desc>
            <AssignActivate>#x300</AssignActivate>
          </OpMode>
        </Dc>
        <Eeprom>
          <ByteSize>2048</ByteSize>
          <ConfigData>050600446400000000001A000000</ConfigData>
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
      const configData = `050600446400000000001A000000`;
      expect(result).toEqualLines(configData);
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

#define MAX_MAPPINGS_SM2 2
#define MAX_MAPPINGS_SM3 2

#define MAX_RXPDO_SIZE   512
#define MAX_TXPDO_SIZE   512

#endif /* __ECAT_OPTIONS_H__ */
`;
      expect(result).toEqualLines(ecat_options);
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
static const char acName1001[] = "Error register";
static const char acName1008[] = "Device Name";
static const char acName1009[] = "Hardware Version";
static const char acName100A[] = "Software Version";
static const char acName1018[] = "Identity Object";
static const char acName1018_00[] = "Max SubIndex";
static const char acName1018_01[] = "Vendor ID";
static const char acName1018_02[] = "Product Code";
static const char acName1018_03[] = "Revision Number";
static const char acName1018_04[] = "Serial Number";
static const char acName10F1[] = "Error Settings";
static const char acName10F1_00[] = "Max SubIndex";
static const char acName10F1_01[] = "Local Error Reaction";
static const char acName10F1_02[] = "SyncErrorCounterLimit";
static const char acName1600[] = "Control Word";
static const char acName1600_00[] = "Max SubIndex";
static const char acName1600_01[] = "Control Word";
static const char acName1601[] = "Target position";
static const char acName1601_00[] = "Max SubIndex";
static const char acName1601_01[] = "Target position";
static const char acName1A00[] = "Status Word";
static const char acName1A00_00[] = "Max SubIndex";
static const char acName1A00_01[] = "Status Word";
static const char acName1A01[] = "Position actual";
static const char acName1A01_00[] = "Max SubIndex";
static const char acName1A01_01[] = "Position actual";
static const char acName1C00[] = "Sync Manager Communication Type";
static const char acName1C00_00[] = "Max SubIndex";
static const char acName1C00_01[] = "Communications Type SM0";
static const char acName1C00_02[] = "Communications Type SM1";
static const char acName1C00_03[] = "Communications Type SM2";
static const char acName1C00_04[] = "Communications Type SM3";
static const char acName1C12[] = "Sync Manager 2 PDO Assignment";
static const char acName1C12_00[] = "Max SubIndex";
static const char acName1C12_01[] = "PDO Mapping";
static const char acName1C12_02[] = "PDO Mapping";
static const char acName1C13[] = "Sync Manager 3 PDO Assignment";
static const char acName1C13_00[] = "Max SubIndex";
static const char acName1C13_01[] = "PDO Mapping";
static const char acName1C13_02[] = "PDO Mapping";
static const char acName1C32[] = "Sync Manager 2 Parameters";
static const char acName1C32_00[] = "Max SubIndex";
static const char acName1C32_01[] = "Sync mode";
static const char acName1C32_02[] = "CycleTime";
static const char acName1C32_03[] = "ShiftTime";
static const char acName1C32_04[] = "Sync modes supported";
static const char acName1C32_05[] = "Minimum Cycle Time";
static const char acName1C33[] = "Sync Manager 3 Parameters";
static const char acName1C33_00[] = "Max SubIndex";
static const char acName1C33_01[] = "Sync mode";
static const char acName1C33_02[] = "CycleTime";
static const char acName1C33_03[] = "ShiftTime";
static const char acName1C33_04[] = "Sync modes supported";
static const char acName1C33_05[] = "Minimum Cycle Time";
static const char acName6040[] = "Control Word";
static const char acName6041[] = "Status Word";
static const char acName6060[] = "Modes of operation";
static const char acName6061[] = "Mode of operation display";
static const char acName6064[] = "Position actual";
static const char acName607A[] = "Target position";
static const char acName6502[] = "Supported drive modes";

const _objd SDO1000[] =
{
  {0x0, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1000, 5001, NULL},
};
const _objd SDO1001[] =
{
  {0x0, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1001, 0, &Obj.Error_register},
};
const _objd SDO1008[] =
{
  {0x0, DTYPE_VISIBLE_STRING, 80, ATYPE_RO, acName1008, 0, "STMBL ECAT"},
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
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_01, 4919, NULL},
  {0x02, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_02, 131474, NULL},
  {0x03, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_03, 1, NULL},
  {0x04, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1018_04, 1, &Obj.serial},
};
const _objd SDO10F1[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName10F1_00, 2, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName10F1_01, 0, &Obj.Error_Settings.Local_Error_Reaction},
  {0x02, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName10F1_02, 200, &Obj.Error_Settings.SyncErrorCounterLimit},
};
const _objd SDO1600[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1600_00, 1, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1600_01, 0x60400010, NULL},
};
const _objd SDO1601[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1601_00, 1, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1601_01, 0x607A0020, NULL},
};
const _objd SDO1A00[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1A00_00, 1, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1A00_01, 0x60410010, NULL},
};
const _objd SDO1A01[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1A01_00, 1, NULL},
  {0x01, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1A01_01, 0x60640020, NULL},
};
const _objd SDO1C00[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_00, 4, NULL},
  {0x01, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_01, 1, NULL},
  {0x02, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_02, 2, NULL},
  {0x03, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_03, 3, NULL},
  {0x04, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C00_04, 4, NULL},
};
const _objd SDO1C12[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C12_00, 2, NULL},
  {0x01, DTYPE_UNSIGNED16, 16, ATYPE_RO, acName1C12_01, 0x1600, NULL},
  {0x02, DTYPE_UNSIGNED16, 16, ATYPE_RO, acName1C12_02, 0x1601, NULL},
};
const _objd SDO1C13[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C13_00, 2, NULL},
  {0x01, DTYPE_UNSIGNED16, 16, ATYPE_RO, acName1C13_01, 0x1A00, NULL},
  {0x02, DTYPE_UNSIGNED16, 16, ATYPE_RO, acName1C13_02, 0x1A01, NULL},
};
const _objd SDO1C32[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C32_00, 5, NULL},
  {0x01, DTYPE_UNSIGNED16, 16, ATYPE_RWpre, acName1C32_01, 1, &Obj.Sync_Manager_2_Parameters.Sync_mode},
  {0x02, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1C32_02, 0, &Obj.Sync_Manager_2_Parameters.CycleTime},
  {0x03, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1C32_03, 0, &Obj.Sync_Manager_2_Parameters.ShiftTime},
  {0x04, DTYPE_UNSIGNED16, 16, ATYPE_RO, acName1C32_04, 6, &Obj.Sync_Manager_2_Parameters.Sync_modes_supported},
  {0x05, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1C32_05, 125000, &Obj.Sync_Manager_2_Parameters.Minimum_Cycle_Time},
};
const _objd SDO1C33[] =
{
  {0x00, DTYPE_UNSIGNED8, 8, ATYPE_RO, acName1C33_00, 5, NULL},
  {0x01, DTYPE_UNSIGNED16, 16, ATYPE_RWpre, acName1C33_01, 1, &Obj.Sync_Manager_3_Parameters.Sync_mode},
  {0x02, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1C33_02, 0, &Obj.Sync_Manager_3_Parameters.CycleTime},
  {0x03, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1C33_03, 0, &Obj.Sync_Manager_3_Parameters.ShiftTime},
  {0x04, DTYPE_UNSIGNED16, 16, ATYPE_RO, acName1C33_04, 6, &Obj.Sync_Manager_3_Parameters.Sync_modes_supported},
  {0x05, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName1C33_05, 125000, &Obj.Sync_Manager_3_Parameters.Minimum_Cycle_Time},
};
const _objd SDO6040[] =
{
  {0x0, DTYPE_UNSIGNED16, 16, ATYPE_RO | ATYPE_RXPDO, acName6040, 0, &Obj.Control_Word},
};
const _objd SDO6041[] =
{
  {0x0, DTYPE_UNSIGNED16, 16, ATYPE_RO | ATYPE_TXPDO, acName6041, 0, &Obj.Status_Word},
};
const _objd SDO6060[] =
{
  {0x0, DTYPE_INTEGER8, 8, ATYPE_RO, acName6060, 0, &Obj.Modes_of_operation},
};
const _objd SDO6061[] =
{
  {0x0, DTYPE_INTEGER8, 8, ATYPE_RO, acName6061, 0, &Obj.Mode_of_operation_display},
};
const _objd SDO6064[] =
{
  {0x0, DTYPE_UNSIGNED32, 32, ATYPE_RO | ATYPE_TXPDO, acName6064, 0, &Obj.Position_actual},
};
const _objd SDO607A[] =
{
  {0x0, DTYPE_UNSIGNED32, 32, ATYPE_RO | ATYPE_RXPDO, acName607A, 0, &Obj.Target_position},
};
const _objd SDO6502[] =
{
  {0x0, DTYPE_UNSIGNED32, 32, ATYPE_RO, acName6502, 0, &Obj.Supported_drive_modes},
};

const _objectlist SDOobjects[] =
{
  {0x1000, OTYPE_VAR, 0, 0, acName1000, SDO1000},
  {0x1001, OTYPE_VAR, 0, 0, acName1001, SDO1001},
  {0x1008, OTYPE_VAR, 0, 0, acName1008, SDO1008},
  {0x1009, OTYPE_VAR, 0, 0, acName1009, SDO1009},
  {0x100A, OTYPE_VAR, 0, 0, acName100A, SDO100A},
  {0x1018, OTYPE_RECORD, 4, 0, acName1018, SDO1018},
  {0x10F1, OTYPE_RECORD, 2, 0, acName10F1, SDO10F1},
  {0x1600, OTYPE_RECORD, 1, 0, acName1600, SDO1600},
  {0x1601, OTYPE_RECORD, 1, 0, acName1601, SDO1601},
  {0x1A00, OTYPE_RECORD, 1, 0, acName1A00, SDO1A00},
  {0x1A01, OTYPE_RECORD, 1, 0, acName1A01, SDO1A01},
  {0x1C00, OTYPE_ARRAY, 4, 0, acName1C00, SDO1C00},
  {0x1C12, OTYPE_ARRAY, 2, 0, acName1C12, SDO1C12},
  {0x1C13, OTYPE_ARRAY, 2, 0, acName1C13, SDO1C13},
  {0x1C32, OTYPE_RECORD, 5, 0, acName1C32, SDO1C32},
  {0x1C33, OTYPE_RECORD, 5, 0, acName1C33, SDO1C33},
  {0x6040, OTYPE_VAR, 0, 0, acName6040, SDO6040},
  {0x6041, OTYPE_VAR, 0, 0, acName6041, SDO6041},
  {0x6060, OTYPE_VAR, 0, 0, acName6060, SDO6060},
  {0x6061, OTYPE_VAR, 0, 0, acName6061, SDO6061},
  {0x6064, OTYPE_VAR, 0, 0, acName6064, SDO6064},
  {0x607A, OTYPE_VAR, 0, 0, acName607A, SDO607A},
  {0x6502, OTYPE_VAR, 0, 0, acName6502, SDO6502},
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

   /* Inputs */

   uint16_t Status_Word;
   uint32_t Position_actual;

   /* Outputs */

   uint16_t Control_Word;
   uint32_t Target_position;

   /* Parameters */

   uint8_t Error_register;
   struct
   {
      uint32_t Local_Error_Reaction;
      uint32_t SyncErrorCounterLimit;
   } Error_Settings;
   struct
   {
      uint16_t Sync_mode;
      uint32_t CycleTime;
      uint32_t ShiftTime;
      uint16_t Sync_modes_supported;
      uint32_t Minimum_Cycle_Time;
   } Sync_Manager_2_Parameters;
   struct
   {
      uint16_t Sync_mode;
      uint32_t CycleTime;
      uint32_t ShiftTime;
      uint16_t Sync_modes_supported;
      uint32_t Minimum_Cycle_Time;
   } Sync_Manager_3_Parameters;
   int8_t Modes_of_operation;
   int8_t Mode_of_operation_display;
   uint32_t Supported_drive_modes;
} _Objects;

extern _Objects Obj;

#endif /* __UTYPES_H__ */
`;
    expect(result).toEqualLines(expectedUtypes);
    });
  });
});
