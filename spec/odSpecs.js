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
            { name: 'PDO Mapping', value: '0x1600' }
        ]};
        expected['1600'] = { otype: 'RECORD', name: 'RxPDO', items: [ 
            { name: 'Max SubIndex' },
            { name: 'RxPDO', dtype: 'UNSIGNED32', value: '0x70000008' }
        ]};
        expected['7000'] = { dtype: DTYPE.UNSIGNED8, otype: OTYPE.VAR, name: 'RxPDO', value: 42, pdo_mappings: ['rxpdo'], data: '&Obj.RxPDO' };
        expect(result).toEqual(expected);
      });
    });
  });

});
