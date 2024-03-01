describe("backup", function() {
  
  beforeEach(function() {
  });

  it("should return false for button control", function() {
    // arrange
    const control = { type: 'button' };
    // act
    const result = isBackedUp(control);
    // assert
    expect(result).toEqual(false);
  });
});