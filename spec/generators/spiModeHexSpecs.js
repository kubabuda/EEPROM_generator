describe("hex_generator given SPImode", function () {
  const testCases = [
    { mode: 0 },
    { mode: 1 },
    { mode: 2 },
    { mode: 3 },
  ];
  let form;
  let odSections;
  
  let od;
  let indexes;
  
  beforeEach(function() {
      form = buildMockFormHelper();
      odSections = getEmptyObjDict();
      od = buildObjectDictionary(form, odSections);
      indexes = getUsedIndexes(od);
  });

  testCases.forEach((test, index) => {
    it(`SPImode ${test.mode} should return 05060${test.mode}44640000 (testcase: ${index + 1})`, () => {
      // arrange
      form.SPImode.value = test.mode;
      
      // act
      const result = hex_generator(form, true);
      
      // assert
      expect(result).toEqual(`05060${test.mode}44640000`);
    });
  });
});
