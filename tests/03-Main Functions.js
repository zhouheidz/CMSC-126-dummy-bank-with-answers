var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var fs = require('fs');
var vm = require('vm');
var path = './functions.js';

var code = fs.readFileSync(path);
vm.runInThisContext(code);

chai.config.includeStack = false;
chai.config.truncateThreshold = 0;

describe('Dummy Bank Function Tests', function() {
  it('"validity check for deposting values greater than zero", should return true ', function(){
    return chai.expect(validAmount(1)).to.deep.equal(true);
  });

  it('"validity check for depositing values less than zero", should return false ', function(){
    return chai.expect(validAmount(-1)).to.deep.equal(false);
  });

   it('"validity check for transferring values greater than zero", should return true ', function(){
    return chai.expect(validAmount(1)).to.deep.equal(true);
  });

  it('validity check for transferring values less than zero", should return false ', function(){
    return chai.expect(validAmount(-1)).to.deep.equal(false);
  });

   it('validity check for withdrawing values greater than zero", should return true ', function(){
    return chai.expect(validAmount(1)).to.deep.equal(true);
  });

  it('validity check for withdrawing values less than zero", should return false ', function(){
    return chai.expect(validAmount(-1)).to.deep.equal(false);
  });
   
});
