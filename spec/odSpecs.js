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
      it("given empty OD sections and form should return expected OD", function() {
          // arrange
          const odSections = getEmptyObjDict();
          const form = buildMockFormHelper();
          
          // const result = toEsiEepromH(bytes);
          const  result = buildObjectDictionary(form, odSections);
          
          // assert
          const expected = getExpectedEmptyOd();
          // console.log(expected);
          expect(result).toEqual(expected);
      });
  });

});
