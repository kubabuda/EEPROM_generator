describe("generators", function() {
  beforeEach(function() {
    jasmine.addMatchers(customMatchers);
  });

  describe("ESC-specific generators", function() {
    describe("for AX58100 project", function() {
      let form;
      let odSections;
      
      beforeEach(function() {
        form = buildMockFormHelper();
        form.ESC.value = SupportedESC.AX58100
        odSections = getEmptyObjDict();
        od = buildObjectDictionary(form, odSections);
      });

      it("hex_generator should generate config data 050603446400000000001A000000", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `050603446400000000001A000000`;
        expect(result).toEqual(configData);
      });
    });

    describe("for ET1100 project", function() {
      let form;
      
      beforeEach(function() {
          form = buildMockFormHelper();
          form.ESC.value = SupportedESC.ET1100
      });

      it("hex_generator should generate config data 05060344640000", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `05060344640000`;
        expect(result).toEqual(configData);
      });
    });

    describe("for LAN9252 project", function() {
      let form;
      let odSections;
      
      beforeEach(function() {
        form = buildMockFormHelper();
        form.ESC.value = SupportedESC.LAN9252
        odSections = getEmptyObjDict();
        od = buildObjectDictionary(form, odSections);
      });

      it("hex_generator should generate config data 80060344640000", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `80060344640000`;
        expect(result).toEqual(configData);
      });
    });

    describe("for LAN9253_Beckhoff project", function() {
      let form;
      
      beforeEach(function() {
          form = buildMockFormHelper();
          form.ESC.value = SupportedESC.LAN9253_Beckhoff
      });

      it("hex_generator should generate config data 0506034464000000000040C00000", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `0506034464000000000040C00000`;
        expect(result).toEqual(configData);
      });
    });

    describe("for LAN9253_Direct project", function() {
      let form;
      
      beforeEach(function() {
          form = buildMockFormHelper();
          form.ESC.value = SupportedESC.LAN9253_Direct
      });

      it("hex_generator should generate config data 8206034464000000000040C00000", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `8206034464000000000040C00000`;
        expect(result).toEqual(configData);
      });
    });

    describe("for LAN9253_Indirect project", function() {
      let form;
      
      beforeEach(function() {
          form = buildMockFormHelper();
          form.ESC.value = SupportedESC.LAN9253_Indirect
      });

      it("hex_generator should generate config data 8006034464000000000040C00000", function() {
        // arrange
        // act
        const result = hex_generator(form, true);
        
        // assert
        const configData = `8006034464000000000040C00000`;
        expect(result).toEqual(configData);
      });
    });
  });
});
