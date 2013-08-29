var should = require('should'),
    long = require('../');

describe('Creation', function() {
  describe('Hex String', function() {
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

describe('Binary Functions', function() {
  describe('AND', function() {
    it('0xAABBCCDD00000000 & 0xAABBCCDD00000000 -> 0xAABBCCDD00000000', function() {
      var result = long.and([0xAABBCCDD, 0], [0xAABBCCDD, 0]);
      result.should.eql([0xAABBCCDD, 0]);
    });

    it('0xAABBCCDD00000000 & 0x00000000AABBCCDD -> 0x0000000000000000', function() {
      var result = long.and([0xAABBCCDD, 0], [0, 0xAABBCCDD]);
      result.should.eql([0, 0]);
    });

    it('0xAABBCCDDEEFF0011 & 0x0F0F0F0F0F0F0F0F -> 0x0A0B0C0D0E0F0001', function() {
      var result = long.and([0xAABBCCDD, 0xEEFF0011], [0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0x0A0B0C0D, 0x0E0F0001]);
    });
  });

  describe('OR', function() {
    it('0xAABBCCDDEEFF0011 OR 0x0F0F0F0F0F0F0F0F -> 0xAFBFCFDFEFFF0F1F', function() {
      var result = long.or([0xAABBCCDD, 0xEEFF0011], [0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0xAFBFCFDF, 0xEFFF0F1F]);
    });

    it('0x0A0B0C0D0E0F0001 OR 0xA0B0C0D0E0F00010 -> 0xAABBCCDDEEFF0011', function() {
      var result = long.or([0x0A0B0C0D, 0x0E0F0001], [0xA0B0C0D0, 0xE0F00010]);
      result.should.eql([0xAABBCCDD, 0xEEFF0011]);
    });
  });

  describe('XOR', function() {
    it('0xAABBCCDDEEFF0011 XOR 0x0F0F0F0F0F0F0F0F -> 0xA5B4C3D2E1F00F1E', function() {
      var result = long.xor([0xAABBCCDD, 0xEEFF0011], [0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0xa5b4c3d2, 0xe1f00f1e]);
    });

    it('0xA0B0C0D0E0F00010 XOR 0x0F0F0F0F0F0F0F0F -> 0xAFBFCFDFEFFF0F1F', function() {
      var result = long.xor([0xA0B0C0D0, 0xE0F00010], [0x0F0F0F0F, 0x0F0F0F0F]);
      result.should.eql([0xAFBFCFDF, 0xEFFF0F1F]);
    });
  });

  describe('Rotate Left', function() {
    it ('0x8000000000000000 rotl 1 -> 1', function() {
      var result = long.rotl([0x80000000, 0], 1);
      result.should.eql([0, 1]);
    });

    it ('0xAABBCCDDEEFF0011 rotl 8 -> 0xBBCCDDEEFF0011AA', function() {
      var result = long.rotl([0xAABBCCDD, 0xEEFF0011], 8);
      result.should.eql([0xBBCCDDEE, 0xFF0011AA]);
    });
  })

  describe('Rotate Right', function() {
    it ('0x8000000000000000 rotr 1 -> 0', function() {
      var result = long.rotr([0, 1], 1);
      result.should.eql([0x80000000, 0]);
    });

    it ('0xAABBCCDDEEFF0011 rotr 8 -> 0x11AABBCCDDEEFF00', function() {
      var result = long.rotr([0xAABBCCDD, 0xEEFF0011], 8);
      result.should.eql([0x11aabbcc, 0xddeeff00]);
    });
  })


  describe('Shift Left', function() {
    it ('0x8000000000000000 shiftl 1 -> 0', function() {
      var result = long.shiftl([0x80000000, 0], 1);
      result.should.eql([0, 0]);
    });

    it ('0xAABBCCDDEEFF0011 shiftl 8 -> 0xBBCCDDEEFF001100', function() {
      var result = long.shiftl([0xAABBCCDD, 0xEEFF0011], 8);
      result.should.eql([0xBBCCDDEE, 0xFF001100]);
    });

    it ('0xAA shiftl 8 -> 0xAA00', function() {
      var result = long.shiftl([0, 0xAA], 8);
      result.should.eql([0, 0xAA00]);
    });

    it ('0xAA shiftl 16 -> 0xAA0000', function() {
      var result = long.shiftl([0, 0xAA], 16);
      result.should.eql([0, 0xAA0000]);
    });

    it ('0xAA shiftl 32 -> 0xAA00000000', function() {
      var result = long.shiftl([0, 0xAA], 32);
      result.should.eql([0xAA, 0]);
    });

    it ('0xAA shiftl 64 -> 0', function() {
      var result = long.shiftl([0, 0xAA], 64);
      result.should.eql([0, 0]);
    });
  })

  describe('Shift Right', function() {
    it ('0x01 shiftr 1 -> 0', function() {
      var result = long.shiftr([0, 1], 1);
      result.should.eql([0, 0]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 8 -> 0x00AABBCCDDEEFF00', function() {
      var result = long.shiftr([0xAABBCCDD, 0xEEFF0011], 8);
      result.should.eql([0x00AABBCC, 0xDDEEFF00]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 16 -> 0x0000AABBCCDDEEFF', function() {
      var result = long.shiftr([0xAABBCCDD, 0xEEFF0011], 16);
      result.should.eql([0x0000AABB, 0xCCDDEEFF]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 32 -> 0x00000000AABBCCDD', function() {
      var result = long.shiftr([0xAABBCCDD, 0xEEFF0011], 32);
      result.should.eql([0x00000000, 0xAABBCCDD]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 48 -> 0x000000000000AABB', function() {
      var result = long.shiftr([0xAABBCCDD, 0xEEFF0011], 48);
      result.should.eql([0x00000000, 0x0000AABB]);
    });

    it ('0xAABBCCDDEEFF0011 shiftr 64 -> 0x0000000000000000', function() {
      var result = long.shiftr([0xAABBCCDD, 0xEEFF0011], 64);
      result.should.eql([0x00000000, 0x00000000]);
    });
  })


  describe('Add 64', function() {
    it ('Simple1', function() {
      var result = long.add([0xAABBCCDD, 0], [0, 0xEEFF0011]);
      result.should.eql([0xAABBCCDD, 0xEEFF0011]);
    });

    it ('Simple2', function() {
      var result = long.add([0x9bcced90, 0x4e4ee874], [0x0b46f7a4, 0xb2adfb7d]);
      result.should.eql([0xa713e535, 0x00fce3f1]);
    });

    it ('Simple with Overflow', function() {
      var result = long.add([0x3bdfcd16, 0x91e30f3f], [0xff11fd41, 0x5a3ea330]);
      result.should.eql([0x3af1ca57, 0xec21b26f]);
    });

    it ('Overflow on low: 1', function() {
      var result = long.add([0, 0xFFFFFFFF], [0, 1]);
      result.should.eql([1, 0]);
    });

    it ('Overflow on low: 0xFF', function() {
      var result = long.add([0, 0xFFFFFFFF], [0, 0xFF]);
      result.should.eql([1, 0xFE]);
    });

    it ('Overflow on low: 0x100', function() {
      var result = long.add([0, 0xFFFFFF00], [0, 0x1FF]);
      result.should.eql([1, 0xff]);
    });
  })

  describe('Multiply 64', function() {
    it ('Simple', function() {
      var result = long.multiply([0, 0xFFFFFFFF], [0, 2]);
      result.should.eql([1, 0xFFFFFFFE >> 0]);
    });


    it ('0xFFFFFFFF * 0xFFFFFFFF', function() {
      var result = long.multiply([0, 0xFFFFFFFF], [0, 0xFFFFFFFF]);
      result.should.eql([0xfffffffe >> 0, 0x00000001]);
    });

    it ('0xAABBCCDD * 0xEEFF0011 :: negative signed', function() {
      var result = long.multiply([0, 0xAABBCCDD], [0, 0xEEFF0011]);
      result.should.eql([0x9f64a991 >> 0, 0xdc9b9aad >> 0]);
    });

    it ('0xAABBCCDD * 0x0011EEFF :: negative/positive', function() {
      var result = long.multiply([0, 0xAABBCCDD], [0, 0x0011EEFF]);
      result.should.eql([0xbf5dd, 0x44338623]);
    });

    it ('0x0011EEFF * 0xAABBCCDD :: commutative of above', function() {
      var result = long.multiply([0, 0xAABBCCDD], [0, 0x0011EEFF]);
      result.should.eql([0xbf5dd, 0x44338623]);
    });
  })
})
