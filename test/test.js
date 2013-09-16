var should = require('should'),
    long = require('../');

describe('Creation', function() {
  describe('Hex String', function() {
    it('"0xA" -> 0xA', function() {
      long.make("A").should.eql([0, 0xA]);
    });

    it('"0xFF" -> 0xFF', function() {
      long.make("0xFF").should.eql([0, 0xFF]);
    });

    it('"000FF" -> 0xFF', function() {
      long.make("000FF").should.eql([0, 0xFF]);
    });

    it('"749D9A55669A5566" -> 0x749D9A55669A5566', function() {
      long.make("749D9A55669A5566").should.eql([0x749D9A55, 0x669A5566]);
    });

    it('"0xAABBCCDDEEFF0011" -> 0xAABBCCDDEEFF0011', function() {
      long.make("0xAABBCCDDEEFF0011").should.eql([0xAABBCCDD, 0xEEFF0011]);
    });

    it('"AABBCCDDEEFF0011" -> 0xAABBCCDDEEFF0011', function() {
      long.make("AABBCCDDEEFF0011").should.eql([0xAABBCCDD, 0xEEFF0011]);
    });

    it('"0xDEADBEEF01010101" -> 0xDEADBEEF01010101', function() {
      long.make("0xDEADBEEF01010101").should.eql([0xDEADBEEF, 0x01010101]);
    });

    it('"DEADBEEF01010101" -> 0xDEADBEEF01010101', function() {
      long.make("DEADBEEF01010101").should.eql([0xDEADBEEF, 0x01010101]);
    });
  });
});

describe('Basic Functions', function() {
  describe('Greater Than', function() {
    it('0x1 > 0x0 == true', function() { [0,1].gt([0,0]).should.equal(true) });
    it('0x10 > 0x1 == true', function() { [0,0x10].gt([0,1]).should.equal(true) });
    it('0x800 > 0x500 == true', function() { [0,0x800].gt([0,0x500]).should.equal(true) });
    it('0x500 > 0x800 == false', function() { [0,0x500].gt([0,0x800]).should.equal(false) });
    it('0x100000000 > 0x80000000 == true', function() { [1,0].gt([0,0x80000000]).should.equal(true) });
    it('0xAABBCCDDEEFF0011 > 0x00BBCCDDEEFF0011 == true', function() { 
      [0xAABBCCDD,0xEEFF0011].gt([0xBBCCDD,0xEEFF0011]).should.equal(true) 
    });
  });

  describe('Greater Than or Equal', function() {
    it('0x1 >= 0x0 == true', function() { [0,1].gte([0,0]).should.equal(true) });
    it('0x10 >= 0x1 == true', function() { [0,0x10].gte([0,1]).should.equal(true) });
    it('0x500 >= 0x500 == true', function() { [0,0x500].gte([0,0x500]).should.equal(true) });
    it('0x500 >= 0x800 == false', function() { [0,0x500].gte([0,0x800]).should.equal(false) });
    it('0x100000000 >= 0x80000000 == true', function() { [1,0].gte([0,0x80000000]).should.equal(true) });
    it('0xAABBCCDDEEFF0011 >= 0xAABBCCDDEEFF0011 == true', function() { 
      [0xAABBCCDD,0xEEFF0011].gte([0xAABBCCDD,0xEEFF0011]).should.equal(true) 
    });
  });

  describe('Less Than', function() {
    it('0x1 < 0x0 == false', function() { [0,1].lt([0,0]).should.equal(false) });
    it('0x1 < 0x10 == true', function() { [0,0x1].lt([0,0x10]).should.equal(true) });
    it('0x80 < 0x500 == true', function() { [0,0x80].lt([0,0x500]).should.equal(true) });
    it('0x50 < 0x800 == true', function() { [0,0x50].lt([0,0x800]).should.equal(true) });
    it('0x100000000 < 0x80000000 == false', function() { [1,0].lt([0,0x80000000]).should.equal(false) });
    it('0xAABBCCDDEEFF0011 < 0x00BBCCDDEEFF0011 == false', function() { 
      [0xAABBCCDD,0xEEFF0011].lt([0xBBCCDD,0xEEFF0011]).should.equal(false) 
    });
  });

  describe('Less Than or Equal', function() {
    it('0x1 <= 0x0 == false', function() { [0,1].lte([0,0]).should.equal(false) });
    it('0x10 <= 0x10 == true', function() { [0,0x10].lte([0,0x10]).should.equal(true) });
    it('0x80 <= 0x500 == true', function() { [0,0x80].lte([0,0x500]).should.equal(true) });
    it('0x800 <= 0x800 == true', function() { [0,0x800].lte([0,0x800]).should.equal(true) });
    it('0x100000000 <= 0x80000000 == false', function() { [1,0].lte([0,0x80000000]).should.equal(false) });
    it('0xAABBCCDDEEFF0011 <= 0x00BBCCDDEEFF0011 == false', function() { 
      [0xAABBCCDD,0xEEFF0011].lte([0xBBCCDD,0xEEFF0011]).should.equal(false) 
    });
  });
});

describe('Binary Functions', function() {
  describe('AND', function() {
    it('0xAABBCCDD00000000 & 0xAABBCCDD00000000 -> 0xAABBCCDD00000000', function() {
      var result = [0xAABBCCDD, 0].and([0xAABBCCDD, 0]);
      result.should.eql([0xAABBCCDD, 0]);
    });

    it('0xAABBCCDD00000000 & 0x00000000AABBCCDD -> 0x0000000000000000', function() {
      var result = [0xAABBCCDD, 0].and([0, 0xAABBCCDD]);
      result.should.eql([0, 0]);
    });

    it('0xAABBCCDDEEFF0011 & 0x0F0F0F0F0F0F0F0F -> 0x0A0B0C0D0E0F0001', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].and([0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0x0A0B0C0D, 0x0E0F0001]);
    });
  });

  describe('OR', function() {
    it('0xAABBCCDDEEFF0011 OR 0x0F0F0F0F0F0F0F0F -> 0xAFBFCFDFEFFF0F1F', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].or([0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0xAFBFCFDF, 0xEFFF0F1F]);
    });

    it('0x0A0B0C0D0E0F0001 OR 0xA0B0C0D0E0F00010 -> 0xAABBCCDDEEFF0011', function() {
      var result = [0x0A0B0C0D, 0x0E0F0001].or([0xA0B0C0D0, 0xE0F00010]);
      result.should.eql([0xAABBCCDD, 0xEEFF0011]);
    });
  });

  describe('XOR', function() {
    it('0xAABBCCDDEEFF0011 XOR 0x0F0F0F0F0F0F0F0F -> 0xA5B4C3D2E1F00F1E', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].xor([0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0xa5b4c3d2, 0xe1f00f1e]);
    });

    it('0xA0B0C0D0E0F00010 XOR 0x0F0F0F0F0F0F0F0F -> 0xAFBFCFDFEFFF0F1F', function() {
      var result = [0xA0B0C0D0, 0xE0F00010].xor([0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0xAFBFCFDF, 0xEFFF0F1F]);
    });
  });

  describe('Rotate Left', function() {
    it ('0x8000000000000000 rotl 1 -> 1', function() {
      var result = [0x80000000, 0].rotl(1);
      result.should.eql([0, 1]);
    });

    it ('0xAABBCCDDEEFF0011 rotl 8 -> 0xBBCCDDEEFF0011AA', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].rotl(8);
      result.should.eql([0xBBCCDDEE, 0xFF0011AA]);
    });
  })

  describe('Rotate Right', function() {
    it ('0x8000000000000000 rotr 1 -> 0', function() {
      var result = [0, 1].rotr(1);
      result.should.eql([0x80000000, 0]);
    });

    it ('0xAABBCCDDEEFF0011 rotr 8 -> 0x11AABBCCDDEEFF00', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].rotr(8);
      result.should.eql([0x11aabbcc, 0xddeeff00]);
    });
  })


  describe('Shift Left', function() {
    it ('0x8000000000000000 shiftl 1 -> 0', function() {
      var result = [0x80000000, 0].shiftl(1);
      result.should.eql([0, 0]);
    });

    it ('0xAABBCCDDEEFF0011 shiftl 8 -> 0xBBCCDDEEFF001100', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].shiftl(8);
      result.should.eql([0xBBCCDDEE, 0xFF001100]);
    });

    it ('0xAA shiftl 8 -> 0xAA00', function() {
      var result = [0, 0xAA].shiftl(8);
      result.should.eql([0, 0xAA00]);
    });

    it ('0xAA shiftl 16 -> 0xAA0000', function() {
      var result = [0, 0xAA].shiftl(16);
      result.should.eql([0, 0xAA0000]);
    });

    it ('0xAA shiftl 32 -> 0xAA00000000', function() {
      var result = [0, 0xAA].shiftl(32);
      result.should.eql([0xAA, 0]);
    });

    it ('0xAA shiftl 64 -> 0', function() {
      var result = [0, 0xAA].shiftl(64);
      result.should.eql([0, 0]);
    });

    it('0xEEFF0011 shiftl 16 -> 0x0000EEFF00110000', function() {
      var result = [0, 0xEEFF0011].shiftl(16);
      result.should.eql([0x0000EEFF, 0x00110000]);
    });
  })

  describe('Shift Right', function() {
    it ('0x01 shiftr 1 -> 0', function() {
      var result = [0, 1].shiftr(1);
      result.should.eql([0, 0]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 8 -> 0x00AABBCCDDEEFF00', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].shiftr(8);
      result.should.eql([0x00AABBCC, 0xDDEEFF00]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 16 -> 0x0000AABBCCDDEEFF', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].shiftr(16);
      result.should.eql([0x0000AABB, 0xCCDDEEFF]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 32 -> 0x00000000AABBCCDD', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].shiftr(32);
      result.should.eql([0x00000000, 0xAABBCCDD]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 48 -> 0x000000000000AABB', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].shiftr(48);
      result.should.eql([0x00000000, 0x0000AABB]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 64 -> 0x0000000000000000', function() {
      var result = [0xAABBCCDD, 0xEEFF0011].shiftr(64);
      result.should.eql([0x00000000, 0x00000000]);
    });

    it ('0xFFFFFFFF00000000 shiftr 32 -> 0x00000000FFFFFFFF', function() {
      var result = [0xFFFFFFFF, 0].shiftr(32);
      result.should.eql([0, 0xFFFFFFFF]);
    });
  })


  describe('Add', function() {
    it ('Simple1', function() {
      var result = [0xAABBCCDD, 0].add([0, 0xEEFF0011]);
      result.should.eql([0xAABBCCDD, 0xEEFF0011]);
    });

    it ('Simple2', function() {
      var result = [0x9bcced90, 0x4e4ee874].add([0x0b46f7a4, 0xb2adfb7d]);
      result.should.eql([0xa713e535, 0x00fce3f1]);
    });

    it ('Simple with Overflow', function() {
      var result = [0x3bdfcd16, 0x91e30f3f].add([0xff11fd41, 0x5a3ea330]);
      result.should.eql([0x3af1ca57, 0xec21b26f]);
    });

    it ('Overflow on low: 1', function() {
      var result = [0, 0xFFFFFFFF].add([0, 1]);
      result.should.eql([1, 0]);
    });

    it ('Overflow on low: 0xFF', function() {
      var result = [0, 0xFFFFFFFF].add([0, 0xFF]);
      result.should.eql([1, 0xFE]);
    });

    it ('Overflow on low: 0x100', function() {
      var result = [0, 0xFFFFFF00].add([0, 0x1FF]);
      result.should.eql([1, 0xff]);
    });
  });

  
  describe('Subtract', function() {
    it('1 - 1 == 0', function() {
      [0, 1].subtract([0, 1]).should.eql([0, 0]);
    });

    it('1 - 0 == 1', function() {
      [0, 1].subtract([0, 0]).should.eql([0, 1]);
    });

    it('5 - 10 == 0', function() {
      [0, 5].subtract([0, 10]).should.eql([0,0]);
    });

    it('0xFFFFFFFF - 0xF == 0xFFFFFFF0', function() {
      [0, 0xFFFFFFFF].subtract([0, 0xF]).should.eql([0,0xFFFFFFF0]);
    });

    it('0x00000001 - 0xFF == 0', function() {
      [0,1].subtract([0, 0xFF]).should.eql([0,0]);
    });
 
    it('0x100000000 - 1 == 0xFFFFFFFF', function() {
      [0x1, 0x0].subtract([0, 1])
          .should.eql([0, 0xFFFFFFFF]);
    });

    it('0x100000001 - 1 == 0x100000000', function() {
      [0x1, 0x1].subtract([0, 1])
          .should.eql([1, 0]);
    });

    it('0xA00000000 - 0xA00000000 == 0x0', function() {
      [0xA, 0x0].subtract([0xA, 0])
          .should.eql([0, 0]);
    });

    it('0xF00000000 - 0xA00000000 == 0x500000000', function() {
      [0xF, 0x0].subtract([0xA, 0])
          .should.eql([0x5, 0]);
    });

    it('0xFFFFFFFF00000000 - 0x00000000FFFFFFFF == 0xfffffffe00000001', function() {
      [0xFFFFFFFF, 0].subtract([0, 0xFFFFFFFF])
          .should.eql([0xfffffffe, 0x00000001]);
    });

    it('0xFFFFFFFFFFFFFFFF - 0xFFFFFFFFFFFFFFFF == 0x0', function() {
      [0xFFFFFFFF, 0xFFFFFFFF].subtract([0xFFFFFFFF, 0xFFFFFFFF])
          .should.eql([0, 0]);
    });

    it('0xFFFFFFFFFFFFFFFF - 0xFFFFFFFFFFFFFFFE == 0x1', function() {
      [0xFFFFFFFF, 0xFFFFFFFF].subtract([0xFFFFFFFF, 0xFFFFFFFE])
          .should.eql([0, 1]);
    });

    it('0xFFFFFFFFFFFFFFFF - 0xEEEEEEEEEEEEEEEE == 0x1111111111111111', function() {
      [0xFFFFFFFF, 0xFFFFFFFF].subtract([0xEEEEEEEE, 0xEEEEEEEE])
          .should.eql([0x11111111, 0x11111111]);
    });
  });
  

  describe('Multiply', function() {
    it ('Simple', function() {
      var result = [0, 0xFFFFFFFF].multiply([0, 2]);
      result.should.eql([1, 0xFFFFFFFE >> 0]);
    });


    it ('0xFFFFFFFF * 0xFFFFFFFF', function() {
      var result = [0, 0xFFFFFFFF].multiply([0, 0xFFFFFFFF]);
      result.should.eql([0xfffffffe >> 0, 0x00000001]);
    });

    it ('0xAABBCCDD * 0xEEFF0011 :: negative signed', function() {
      var result = [0, 0xAABBCCDD].multiply([0, 0xEEFF0011]);
      result.should.eql([0x9f64a991 >> 0, 0xdc9b9aad >> 0]);
    });

    it ('0xAABBCCDD * 0x0011EEFF :: negative/positive', function() {
      var result = [0, 0xAABBCCDD].multiply([0, 0x0011EEFF]);
      result.should.eql([0xbf5dd, 0x44338623]);
    });

    it ('0x0011EEFF * 0xAABBCCDD :: commutative of above', function() {
      var result = [0, 0xAABBCCDD].multiply([0, 0x0011EEFF]);
      result.should.eql([0xbf5dd, 0x44338623]);
    });
  });


  describe('Log2', function() {
    it('Log2(2) = 1', function() {
      [0,2].log2().should.equal(1);
    });

    it('Log2(4) = 2', function() {
      [0,4].log2().should.equal(2);
    });

    it('Log2(8) = 3', function() {
      [0,8].log2().should.equal(3);
    });

    it('Log2(16) = 4', function() {
      [0,16].log2().should.equal(4);
    });

    it('Log2(32) = 5', function() {
      [0,32].log2().should.equal(5);
    });

    it('Log2(64) = 6', function() {
      [0,64].log2().should.equal(6);
    });

    it('Log2(0xFFFFFFFF) = 32', function() {
      [0, 0xFFFFFFFF].log2().should.equal(32);
    });

    it('Log2(0x100000000) = 33', function() {
      [1,0].log2().should.equal(33);
    });

    it('Log2(0x500000000) = 35', function() {
      [5,0].log2().should.equal(35);
    });

    it('Log2(0x8000000000000000) = 64', function() {
      [0xFFFFFFFF,0].log2().should.equal(64);
    });

    it('Log2(0xFF0000000000) = 24', function() {
      [0xFFFFFFFF,0].log2().should.equal(64);
    });

    it('Log2(0xFFFFFFFF00000000) = 64', function() {
      [0xFFFFFFFF,0].log2().should.equal(64);
    });
  });

  describe('Division', function() {
    describe('Powers of Two', function() {
      it('100 / 2 = 50', function() {
        [0, 100].divide([0, 2]).should.eql({quotient:[0, 50], remainder:[0,0]});
      });

      it('[0xAABBCCDD, 0xEEFF0000] / 8 = 0x1557799bbddfe000', function() {
        [0xAABBCCDD, 0xEEFF0000].divide([0, 8]).quotient.should.eql([0x1557799b, 0xbddfe000]);
      });

      it('[0x3D0, 0x9000] / 64 = [0xF, 0x4240]', function() {
        [0, 0x03D09000].divide([0, 64]).quotient.should.eql([0, 0xF4240]);
      });
    });

    describe('Over 10', function() {
      it('100 / 10 == 10', function() {
        [0,100].divide([0,10]).should.eql({
          quotient: [0, 10],
          remainder: [0, 0]
        });
      });

      it('125 / 10 == 12 r5', function() {
        [0,125].divide([0,10]).should.eql({
          quotient: [0, 12],
          remainder: [0, 5]
        });
      });

      it('250 / 10 == 25', function() {
        [0,250].divide([0,10]).should.eql({
          quotient: [0, 25],
          remainder: [0, 0]
        });
      });

      it('0xAABBCCDD / 10 == 0x1112C7AF', function() {
        [0,0xAABBCCDD].divide([0,10]).should.eql({
          quotient: [0, 0x1112C7AF],
          remainder: [0, 7]
        });
      });

      it('0xFFFFFFFF / 10 == 0x19999999', function() {
        [0,0xFFFFFFFF].divide([0,10]).should.eql({
          quotient: [0, 0x19999999],
          remainder: [0, 5]
        });
      });

      it('0x100000000 / 10 == 0x19999999', function() {
        [1, 0].divide([0,10]).should.eql({
          quotient: [0, 0x19999999],
          remainder: [0, 6]
        });
      });

      it('0xAABBCCDDEEFF0011 / 10 == 0x1112C7AFCB198001', function() {
        [0xAABBCCDD, 0xEEFF0011].divide([0,10]).should.eql({
          quotient: [0x1112C7AF, 0xCB198001],
          remainder: [0, 7]
        });
      });
    });

    describe('Non-Powers of Two', function() {
      it('0xF / 5 = 3', function() {
        [0, 0xF].divide([0, 5]).should.eql({
          quotient: [0, 3],
          remainder: [0,0]
        });
      });

      it('100 / 20 = 5', function() {
        [0, 100].divide([0, 20]).should.eql({
          quotient: [0, 5],
          remainder: [0,0]
        });
      });

      it('1000 / 10 = 100', function() {
        [0, 1000].divide([0, 10]).should.eql({
          quotient: [0, 100],
          remainder: [0,0]
        });
      });

      it('750 / 25 = 30', function() {
        [0, 750].divide([0, 25]).should.eql({
          quotient: [0, 30],
          remainder: [0,0]
        });
      });

      it('0x5000 / 0x1000 = 5', function() {
        [0, 0x5000].divide([0, 0x1000]).should.eql({
          quotient: [0, 5],
          remainder: [0,0]
        });
      });

      it('0xFFFFFFFF / 0xF = 0x11111111', function() {
        [0, 0xFFFFFFFF].divide([0, 0xF]).should.eql({
          quotient: [0, 0x11111111],
          remainder: [0,0]
        });
      });

      it('0xFFFFFFFF00000000 / 0xFF = 0x101010100000000', function() {
        var result = [0xFFFFFFFF, 0].divide([0, 0xFF]);
        result.should.eql({
          quotient: [0x1010101, 0],
          remainder: [0, 0]
        });
      });

      it('0xABABABABABABABAB / 0xABAB = 0x1000100010001', function() {
        var result = [0xABABABAB, 0xABABABAB].divide([0, 0xABAB]);
        result.should.eql({
          quotient: [0x10001, 0x00010001],
          remainder: [0, 0]
        });
      });

      it('0xF0F0F0F0F0F0F0F0 / 0x8 = 0x1E1E1E1E1E1E1E1E', function() {
        var result = [0xF0F0F0F0, 0xF0F0F0F0].divide([0, 8]);
        result.should.eql({
          quotient: [0x1E1E1E1E, 0x1E1E1E1E],
          remainder: [0, 0]
        });
      });
    });
  });

  describe('Hex Conversion', function() {
    it('[0xAABBCCDD, 0xEEFF0011] -> "0xAABBCCDDEEFF0011"', function() {
      [0xAABBCCDD, 0xEEFF0011].hex().should.equal("AABBCCDDEEFF0011");
    });

    it('[0xEEFF0011, 0xAABBCCDD] -> "0xEEFF0011AABBCCDD"', function() {
      [0xEEFF0011, 0xAABBCCDD].hex().should.equal("EEFF0011AABBCCDD");
    });

    describe('Error tests', function() {
      it('Cannot be less than 2 members', function() {
        [0xAABBCCDD].hex().should.equal("");
      });

      it('Cannot be more than 2 members', function() {
        [0xAABBCCDD, 0xAABBCCDD, 0xAABBCCDD].hex().should.equal("");
      });
    });
  });


  describe('String Conversion', function() {
    it('0x5 -> "5"', function() {
      [0, 5].string().should.equal("5");
    });

    it('0xA -> "10"', function() {
      [0, 0xA].string().should.equal("10");
    });

    it('0x10 -> "16"', function() {
      [0, 0x10].string().should.equal("16");
    });

    it('0x20 -> "32"', function() {
      [0, 0x20].string().should.equal("32");
    });

    it('0xAABBCCDD -> "2864434397"', function() {
      [0, 0xAABBCCDD].string().should.equal("2864434397");
    });

    it('0xEEFF0011 -> "4009689105"', function() {
      [0, 0xEEFF0011].string().should.equal("4009689105");
    });

    it('0xFFFFFFFF -> "4294967295"', function() {
      [0, 0xFFFFFFFF].string().should.equal("4294967295");
    });

    it('0x100000000 -> "4294967296"', function() {
      [1, 0].string().should.equal("4294967296");
    });

    it('0xF00000000 -> "64424509440"', function() {
      [0xF, 0].string().should.equal("64424509440");
    });

    it('0x8000000000000000 -> "9223372036854775808"', function() {
      [0x80000000, 0].string().should.equal("9223372036854775808");
    });

    it('[0xAABBCCDD, 0xEEFF0011] -> "12302652060662169617"',function() {
      [0xAABBCCDD, 0xEEFF0011].string()
        .should.equal("12302652060662169617");
    });
  });
})
