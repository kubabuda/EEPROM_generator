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
    "CoeDetailsEnableSDOCompleteAccess": false,
    "CoeDetailsEnableUseFoE": false
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

const esi_xml = 
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

describe("readers", function() {
  describe("for example CiA 402 CSP application", function() {
    
    // beforeEach(function() {
    // });
    
    it("xml_reader should read expected form", function() {
      // arrange
      // act
      const result = xml_reader(esi_xml, 'AX58100');

      // assert
      expect(result.form.VendorName).toEqual("kubabuda");
      expect(result.form.VendorID).toEqual("0x1337");
      expect(result.form.ProductCode).toEqual("0x20192");
      expect(result.form.ProfileNo).toEqual("402");
      // expect(result.form.RevisionNumber).toEqual("0x001");
      // expect(result.form.SerialNumber).toEqual("0x001");
      // expect(result.form.HWversion).toEqual("0.0.1");
      // expect(result.form.SWversion).toEqual("0.0.1");
      // expect(result.form.EEPROMsize).toEqual("2048");
      // expect(result.form.RxMailboxOffset).toEqual("0x1000");
      // expect(result.form.TxMailboxOffset).toEqual("0x1200");
      // expect(result.form.MailboxSize).toEqual("512");
      // expect(result.form.SM2Offset).toEqual("0x1600");
      // expect(result.form.SM3Offset).toEqual("0x1A00");
      expect(result.form.TextGroupType).toEqual("Servodrives");
      expect(result.form.TextGroupName5).toEqual("CiA402-compatible");
      // expect(result.form.ImageName).toEqual("IMGCBY");
      expect(result.form.TextDeviceType).toEqual("AC servodrive");
      expect(result.form.TextDeviceName).toEqual("STMBL ECAT");
      // expect(result.form.Port0Physical).toEqual("Y");
      // expect(result.form.Port1Physical).toEqual("Y");
      // expect(result.form.Port2Physical).toEqual(" ");
      // expect(result.form.Port3Physical).toEqual(" ");
      expect(result.form.ESC).toEqual("AX58100");
      // expect(result.form.SPImode).toEqual("0");
      // expect(result.form.CoeDetailsEnableSDO).toEqual(true);
      // expect(result.form.CoeDetailsEnableSDOInfo).toEqual(true);
      // expect(result.form.CoeDetailsEnablePDOAssign).toEqual(false);
      // expect(result.form.CoeDetailsEnablePDOConfiguration).toEqual(false);
      // expect(result.form.CoeDetailsEnableUploadAtStartup).toEqual(true);
      // expect(result.form.CoeDetailsEnableSDOCompleteAccess).toEqual(false);
      // expect(result.form.CoeDetailsEnableUseFoE).toEqual(false);
      
      // const result_string  = JSON.stringify(backupObject, null, 2);
      // expect(result_string).toEqualLines(expectedesi);
    });
  });
});
