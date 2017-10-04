chai.config.includeStack = false;
chai.config.truncateThreshold = 0;

describe('Dummy Bank Tests', function() {
  it('Depositing an amount greater than zero', function(){
    return chai.expect(validAmount(1)).to.deep.equal(true);
  });

  it('Depositing an amount less than zero', function(){
    return chai.expect(validAmount(-1)).to.deep.equal(false);
  });

  it('Transferring amount greater than zero', function(){
    return chai.expect(validAmount(1)).to.deep.equal(true);
  });

  it('Transferring an amount less than zero', function(){
    return chai.expect(validAmount(-1)).to.deep.equal(false);
  });
  it('Withdrawing an amount greater than zero', function(){
    return chai.expect(validAmount(1)).to.deep.equal(true);
  });  
  it('Withdrawing an amount less than zero', function(){
    return chai.expect(validAmount(-1)).to.deep.equal(false);
  });   
});
