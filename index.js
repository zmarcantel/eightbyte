(function() {
  'use strict';

  var eightbyte = {
    version: "0.0.1"
  };

  eightbyte.make = function(string) {
    if (string.length > 18) { throw new Error('Hex string too long'); }
    var start_index = 0;
    if (string.charAt(0) == '0' && string.charAt(1) == 'x') { start_index = 2; }
    var lower = string.slice(-8);
    var upper = string.slice(start_index, -8);
    return [parseInt(upper, 16), parseInt(lower, 16)];
  }

  //-----------------------------------------------------------------
  //
  // Binary Functions Missing in JavaScript
  //
  //-----------------------------------------------------------------

  eightbyte.and = function(a, b) {
    return [(a[0] & b[0]) >>> 0, (a[1] & b[1]) >>> 0];
  }

  eightbyte.xor = function(a, b) {
    return [(a[0] ^ b[0]) >>> 0, (a[1] ^ b[1]) >>> 0];
  }

  eightbyte.or = function(a, b) {
    return [(a[0] | b[0]) >>> 0, (a[1] | b[1]) >>> 0];
  }

  eightbyte.rotl = function(number, bits) {
    if (number[0] == 0 && number[1] == 0)
      return number;

    var high_shifted = (number[0] << bits) >>> 0,
        high_rotated = (number[0] >>> (32 - bits)) >>> 0;

    var low_shifted = (number[1] << bits) >>> 0,
        low_rotated = (number[1] >>> (32 - bits)) >>> 0;

    var high = (high_shifted | low_rotated) >>> 0,
        low = (low_shifted | high_rotated) >>> 0;

    return [high, low];
  }

  eightbyte.rotr = function(number, bits) {
    if (number[0] == 0 && number[1] == 0)
      return number;

    var high_shifted = number[0] >>> bits,
        high_rotated = (number[0] << (32 - bits)) >>> 0;

    var low_shifted = number[1] >>> bits,
        low_rotated = (number[1] << (32 - bits)) >>> 0;

    var high = (high_shifted | low_rotated) >>> 0,
        low = (low_shifted | high_rotated) >>> 0;

    return [high, low];
  }

  eightbyte.shiftl = function(number, bits) {
    var data = number;

    if (number[0] == 0 && number[1] == 0)
      return number;

    if (bits == 64)
      return [0, 0];

    if (bits > 31) {
      data[0] = data[1];
      data[1] = 0;
      bits -= 32;
    }

    var high_shifted = (data[0] << bits) >>> 0,
        low_shifted = (data[1] << bits) >>> 0,
        low_carry = (data[1] >>> (32 - bits)) >>> 0;

    var high = (high_shifted | low_carry) >>> 0,
        low = low_shifted;

    return [high, low];
  }

  eightbyte.shiftr = function(number, bits) {
    var data = number;

    if (number[0] == 0 && number[1] == 0)
      return number;

    if (bits == 64)
      return [0, 0];

    if (bits > 31) {
      data[1] = data[0] >>> 0;
      data[0] = 0;
      bits -= 32;
    }

    var high_shifted = (data[0] >>> bits) >>> 0,
        low_shifted = (data[1] >>> bits) >>> 0,
        high_carry = (data[0] << (32 - bits)) >>> 0;

    var high = high_shifted,
        low = (low_shifted | high_carry) >>> 0;

    return [high, low];
  }


  eightbyte.add = function(a, b) {
    if (a[0] == 0 && a[1] == 0) return b;
    if (b[0] == 0 && b[1] == 0) return a;

    var low = (a[1] + b[1]);
    var carry = low > 0xFFFFFFFF ? (Math.floor(low / Math.pow(2,32)) >>> 0) : 0;
    var high = (a[0] + b[0] + carry);

    return [(high >>> 0), (low >>> 0)];
  }


  eightbyte.subtract = function(a, b) {
    if (a[0] == 0 && a[1] == 0) return b;
    if (b[0] == 0 && b[1] == 0) return a;

    var high = a[0];
    var low = (a[1] - b[1]);

    if (low < 0) {
      low = 0xFFFFFFFF - (low + high);
      high = 0xFFFFFFFF - (high + low);
    }

    high -= b[0];

    if (high < 0) high = 0;
    if (low < 0) low = 0;

    return [high, low];
  }


  eightbyte.multiply = function(a, b) {
    a = [a[0] >>> 16, a[0] & 0xffff, a[1] >>> 16, a[1] & 0xffff];
    b = [b[0] >>> 16, b[0] & 0xffff, b[1] >>> 16, b[1] & 0xffff];
    var o = [0, 0, 0, 0];

    o[3] += a[3] * b[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;

    o[2] += a[2] * b[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;

    o[2] += a[3] * b[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;

    o[1] += a[1] * b[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;

    o[1] += a[2] * b[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;

    o[1] += a[3] * b[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;

    o[0] += (a[0] * b[3]) + (a[1] * b[2]) + (a[2] * b[1]) + (a[3] * b[0]);
    o[0] &= 0xffff;

    o[0] = o[0] >>> 0;
    o[1] = o[1] >>> 0;
    o[2] = o[2] >>> 0;
    o[3] = o[3] >>> 0;

    var result = [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    return result;
  }

  Object.defineProperty(Array.prototype, 'hex', {
    value: function() {
      if (this.length < 2 || this.length > 2) return '';
      var high = this[0] > 0 ? this[0].toString(16).toUpperCase() : '';
      var low = this[1] > 0 ? this[1].toString(16).toUpperCase() : '00000000';
      for (var i = high.length; i < 8; i++) { high = '0' + high; }
      for (var m = low.length; m < 8; m++) { low = '0' + low; }
      return '0x' + high + low;
    }
  });

  module.exports = eightbyte;

})();
