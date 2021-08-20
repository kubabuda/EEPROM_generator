describe("generators", function() {
  
    beforeEach(function() {
    });
  
    it("utypes_generator", function() {
      // arrange
      const form = buildMockFormHelper();
      const od = buildObjectDictionary(form);
      const indexes = getUsedIndexes(od);
  
      // act
      var result = utypes_generator(form, od, indexes);

      // assert
      expect(result).toEqual("yyy");
      });
  });
  