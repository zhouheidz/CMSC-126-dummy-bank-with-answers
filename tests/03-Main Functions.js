var validAmount = require("../index")


describe("Dummy Bank Function Tests", () => {

  it('"validity check for deposting values greater than zero", should return true ', function(){
    expect(validAmount(1)).toBe(true)
  });

  it('"validity check for depositing values less than zero", should return false ', function(){
    expect(validAmount(-1)).toBe(false)
  });

  it('"validity check for transferring values greater than zero", should return true ', function(){
    expect(validAmount(1)).toBe(true)
  });

  it('"validity check for transferring values less than zero", should return false ', function(){
    expect(validAmount(-1)).toBe(false)
  });

  it('"validity check for withdrawing values greater than zero", should return true ', function(){
    expect(validAmount(1)).toBe(true)
  });

  it('"validity check for withdrawing values less than zero", should return false ', function(){
    expect(validAmount(-1)).toBe(false)
  });
  
});

