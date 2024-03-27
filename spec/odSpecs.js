describe("od", function() {
  
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  function getExpectedEmptyOd() {
    return {
        '1000': { otype: 'VAR', dtype: 'UNSIGNED32', name: 'Device Type', value: 5001 },
        '1008': { otype: 'VAR', dtype: 'VISIBLE_STRING', name: 'Device Name', data: '', value: '2-channel Hypergalactic input superimpermanator', size: 47 },
        '1009': { otype: 'VAR', dtype: 'VISIBLE_STRING', name: 'Hardware Version', data: '', value: '0.0.1', size: 5 },
        '1018': { otype: 'RECORD', name: 'Identity Object', items: [ 
            { name: 'Max SubIndex' }, 
            { name: 'Vendor ID', dtype: 'UNSIGNED32', value: 0 }, 
            { name: 'Product Code', dtype: 'UNSIGNED32', value: 700707 }, 
            { name: 'Revision Number', dtype: 'UNSIGNED32', value: 2 }, 
            { name: 'Serial Number', dtype: 'UNSIGNED32', data: '&Obj.serial', value: 1 }
        ]},
        '100A': { otype: 'VAR', dtype: 'VISIBLE_STRING', name: 'Software Version', data: '', value: '0.0.1', size: 5 },
        '1C00': { otype: 'ARRAY', dtype: 'UNSIGNED8', name: 'Sync Manager Communication Type', items: [
            { name: 'Max SubIndex' }, 
            { name: 'Communications Type SM0', value: 1 }, 
            { name: 'Communications Type SM1', value: 2 }, 
            { name: 'Communications Type SM2', value: 3 }, 
            { name: 'Communications Type SM3', value: 4 }
        ]}
    };
  }

  describe('buildObjectDictionary', () => {
    describe('given empty form', () => {
      it("given empty OD sections should return expected OD", function() {
        // arrange
        const odSections = getEmptyObjDict();
        const form = buildMockFormHelper();
        
        // act
        const  result = buildObjectDictionary(form, odSections);
          
        // assert
        const expected = getExpectedEmptyOd();
        expect(result).toEqual(expected);
      });

      it("given variable in SDO should add that variable in returned OD", function() {
        // arrange
        const odSections = getEmptyObjDict();
        odSections.sdo['2000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'SDO', value: 42 };
        const form = buildMockFormHelper();
        
        // act
        const result = buildObjectDictionary(form, odSections);
        
        // assert
        const expected = getExpectedEmptyOd();
        expected['2000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'SDO', value: 42, isSDOitem: true, data: '&Obj.SDO' };
        expect(result).toEqual(expected);
      });

      it("given variable in TXPDO should add Sync Manager 3 PDO assignment, PDO and that variable, in returned OD", function() {
        // arrange
        const odSections = getEmptyObjDict();
        odSections.txpdo['6000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'TxPDO', value: 42 };
        const form = buildMockFormHelper();
        
        // act
        const result = buildObjectDictionary(form, odSections);
        
        // assert
        const expected = getExpectedEmptyOd();
        expected['1C13'] = { otype: 'ARRAY', dtype: 'UNSIGNED16', name: 'Sync Manager 3 PDO Assignment', items: [ 
            { name: 'Max SubIndex' },
            { name: 'PDO Mapping', value: '0x1A00' }
        ]};
        expected['1A00'] = { otype: 'RECORD', name: 'TxPDO', items: [ 
            { name: 'Max SubIndex' },
            { name: 'TxPDO', dtype: 'UNSIGNED32', value: '0x60000008' }
        ]};
        expected['6000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'TxPDO', value: 42, pdo_mappings: ['txpdo'], data: '&Obj.TxPDO' };
        expect(result).toEqual(expected);
      });
      
      it("given variable in RXPDO should add Sync Manager 3 PDO assignment, PDO and that variable, in returned OD", function() {
        // arrange
        const odSections = getEmptyObjDict();
        odSections.rxpdo['7000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'RxPDO', value: 42 };
        const form = buildMockFormHelper();
        
        // act
        const result = buildObjectDictionary(form, odSections);
        
        // assert
        const expected = getExpectedEmptyOd();
        expected['1C12'] = { otype: 'ARRAY', dtype: 'UNSIGNED16', name: 'Sync Manager 2 PDO Assignment', items: [ 
            { name: 'Max SubIndex' },
            { name: 'PDO Mapping', value: '0x1400' }
        ]};
        expected['1400'] = { otype: 'RECORD', name: 'RxPDO', items: [ 
            { name: 'Max SubIndex' },
            { name: 'RxPDO', dtype: 'UNSIGNED32', value: '0x70000008' }
        ]};
        expected['7000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'RxPDO', value: 42, pdo_mappings: ['rxpdo'], data: '&Obj.RxPDO' };
        expect(result).toEqual(expected);
      });
    });

    describe('given given CiA 402 application backed up', () => {
      it("should return populated OD for CiA 402 application", function() {
        // arrange
        // const form = buildMockFormHelper();
        const form = getEmptyFrom();
        const odSections = getEmptyObjDict();
        const dc = [];
        restoreBackup(cia_esi_json, form, odSections, dc);

        // act
        const  result = buildObjectDictionary(form, odSections);
          
        // assert
        const expected = getExpectedEmptyOd();
        expected['1001'] = { otype: 'VAR', name: 'Error register', access: 'RO', dtype: 'UNSIGNED8', value: '0', isSDOitem: true, data: '&Obj.Error_register' };
        expected['1008'] = { otype: 'VAR', dtype: 'VISIBLE_STRING', name: 'Device Name', data: '', value: 'STMBL ECAT', size: 10 },
        expected['1018'] = { otype: 'RECORD', name: 'Identity Object', items: [ 
          { name: 'Max SubIndex' }, 
          { name: 'Vendor ID', dtype: 'UNSIGNED32', value: 4919 }, 
          { name: 'Product Code', dtype: 'UNSIGNED32', value: 131474 }, 
          { name: 'Revision Number', dtype: 'UNSIGNED32', value: 1 }, 
          { name: 'Serial Number', dtype: 'UNSIGNED32', data: '&Obj.serial', value: 1 }
        ]},
        expected['10F1'] = { otype: 'RECORD', name: 'Error Settings', access: 'RO', items: [
          { name: 'Max SubIndex' },
          { name: 'Local Error Reaction', dtype: 'UNSIGNED32', data: '&Obj.Error_Settings.Local_Error_Reaction', value: '0', access: 'RO' },
          { name: 'SyncErrorCounterLimit', dtype: 'UNSIGNED32', value: '200', access: 'RO', data: '&Obj.Error_Settings.SyncErrorCounterLimit' } 
        ], isSDOitem: true };
        expected['1400'] = { otype: 'RECORD', name: 'Control Word', items: [
          { name: 'Max SubIndex' },
          { name: 'Control Word', dtype: 'UNSIGNED32', value: '0x60400010' }
        ] };
        expected['1401'] = { otype: 'RECORD', name: 'Target position', items: [
          { name: 'Max SubIndex' },
          { name: 'Target position', dtype: 'UNSIGNED32', value: '0x607A0020' }
        ] };
        expected['1C32'] = { otype: 'RECORD', name: 'Sync Manager 2 Parameters', access: 'RO', items: [
          { name: 'Max SubIndex' },
          { name: 'Sync mode', dtype: 'UNSIGNED16', value: '1', access: 'RWpre', data: '&Obj.Sync_Manager_2_Parameters.Sync_mode' },
          { name: 'CycleTime', dtype: 'UNSIGNED32', value: '0', data: '&Obj.Sync_Manager_2_Parameters.CycleTime' },
          { name: 'ShiftTime', dtype: 'UNSIGNED32', value: '0', data: '&Obj.Sync_Manager_2_Parameters.ShiftTime' },
          { name: 'Sync modes supported', dtype: 'UNSIGNED16', value: '6', data: '&Obj.Sync_Manager_2_Parameters.Sync_modes_supported' },
          { name: 'Minimum Cycle Time', dtype: 'UNSIGNED32', value: '125000', data: '&Obj.Sync_Manager_2_Parameters.Minimum_Cycle_Time' } 
        ], isSDOitem: true };
        expected['1C33'] = { otype: 'RECORD', name: 'Sync Manager 3 Parameters', access: 'RO', items: [
          { name: 'Max SubIndex' },
          { name: 'Sync mode', dtype: 'UNSIGNED16', data: '&Obj.Sync_Manager_3_Parameters.Sync_mode', value: '1', access: 'RWpre' },
          { name: 'CycleTime', dtype: 'UNSIGNED32', value: '0', access: 'RO', data: '&Obj.Sync_Manager_3_Parameters.CycleTime' },
          { name: 'ShiftTime', dtype: 'UNSIGNED32', value: '0', access: 'RO', data: '&Obj.Sync_Manager_3_Parameters.ShiftTime' },
          { name: 'Sync modes supported', dtype: 'UNSIGNED16', value: '6', access: 'RO', data: '&Obj.Sync_Manager_3_Parameters.Sync_modes_supported' },
          { name: 'Minimum Cycle Time', dtype: 'UNSIGNED32', value: '125000', access: 'RO', data: '&Obj.Sync_Manager_3_Parameters.Minimum_Cycle_Time' } 
        ], isSDOitem: true };
        expected['1A00'] = { otype: 'RECORD', name: 'Status Word', items: [
          { name: 'Max SubIndex' },
          { name: 'Status Word', dtype: 'UNSIGNED32', value: '0x60410010' } 
        ] };
        expected['1A01'] = { otype: 'RECORD', name: 'Position actual', items: [
          { name: 'Max SubIndex' },
          { name: 'Position actual', dtype: 'UNSIGNED32', value: '0x60640020' } 
        ] };
        expected['1C12'] = { otype: 'ARRAY', dtype: 'UNSIGNED16', name: 'Sync Manager 2 PDO Assignment', items: [
          { name: 'Max SubIndex' },
          { name: 'PDO Mapping', value: '0x1400' },
          { name: 'PDO Mapping', value: '0x1401' } 
        ] };
        expected['1C13'] = { otype: 'ARRAY', dtype: 'UNSIGNED16', name: 'Sync Manager 3 PDO Assignment', items: [
          { name: 'Max SubIndex' },
          { name: 'PDO Mapping', value: '0x1A00' },
          { name: 'PDO Mapping', value: '0x1A01' } 
        ] };
        expected['6040'] = { otype: 'VAR', name: 'Control Word', access: 'RO', pdo_mappings: [ 'rxpdo' ], dtype: 'UNSIGNED16', value: '0', data: '&Obj.Control_Word' };
        expected['6041'] = { otype: 'VAR', name: 'Status Word', access: 'RO', pdo_mappings: [ 'txpdo' ], dtype: 'UNSIGNED16', value: '0', data: '&Obj.Status_Word' };
        expected['6060'] = { otype: 'VAR', name: 'Modes of operation', access: 'RO', dtype: 'INTEGER8', value: '0', isSDOitem: true, data: '&Obj.Modes_of_operation' };
        expected['6061'] = { otype: 'VAR', name: 'Mode of operation display', access: 'RO', dtype: 'INTEGER8', value: '0', isSDOitem: true, data: '&Obj.Mode_of_operation_display' };
        expected['6064'] = { otype: 'VAR', name: 'Position actual', access: 'RO', pdo_mappings: [ 'txpdo' ], dtype: 'UNSIGNED32', value: '0', data: '&Obj.Position_actual' };
        expected['6502'] = { otype: 'VAR', name: 'Supported drive modes', access: 'RO', dtype: 'UNSIGNED32', value: '0', isSDOitem: true, data: '&Obj.Supported_drive_modes' };
        expected['607A'] = { otype: 'VAR', name: 'Target position', access: 'RO', pdo_mappings: [ 'rxpdo' ], dtype: 'UNSIGNED32', value: '0', data: '&Obj.Target_position' };
        expect(result).toEqual(expected);
      });
    });
  });

  describe('setArrayLength', () => {
    const testCases = [ 
      { given: -1, expected: 1 },
      { given: 0, expected: 1 },
      { given: 1, expected: 1 },
      { given: 2, expected: 2 },
      { given: 3, expected: 3 },
      { given: 4, expected: 4 }
    ];
    
    testCases.forEach(({given, expected }) => {
      it(`given ${given} should add/remove items until there is MaxSubIndex and ${expected} item${ expected == 1 ? '' : 's'}`, function() {
        // arrange
        const odSections = getEmptyObjDict();
        const objd = getNewObjd(odSections, sdo, OTYPE.ARRAY, DTYPE.UNSIGNED8);
          
        // act
        setArrayLength(objd, given);
          
        // assert
        expect(objd.items.length).toEqual(expected + 1);
        expect(objd.items[0].name).toEqual('Max SubIndex');
      });
    });
  });
});
