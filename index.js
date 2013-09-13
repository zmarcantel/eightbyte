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

  //
  // AND
  //
  Object.defineProperty(Array.prototype, 'and', {
    value:function(b) {
      if (!(this instanceof Array) || !(b instanceof Array) ||
          this.length != 2 || b.length != 2) {
        throw 'Malformed Array -- And';
      }
      return [(this[0] & b[0]) >>> 0, (this[1] & b[1]) >>> 0];
    }
  });


  //
  // XOR
  //
  Object.defineProperty(Array.prototype, 'xor', {
    value:function(b) {
      if (!(this instanceof Array) || !(b instanceof Array) ||
          this.length != 2 || b.length != 2) {
        throw 'Malformed Array -- XOR';
      }
      return [(this[0] ^ b[0]) >>> 0, (this[1] ^ b[1]) >>> 0];
    }
  });


  //
  // OR
  //
  Object.defineProperty(Array.prototype, 'or', {
    value: function(b) {
      if (!(this instanceof Array) || !(b instanceof Array) ||
          this.length != 2 || b.length != 2) {
        throw 'Malformed Array -- OR';
      }
      return [(this[0] | b[0]) >>> 0, (this[1] | b[1]) >>> 0];
    }
  });


  //
  // ROTL
  //
  Object.defineProperty(Array.prototype, 'rotl', {
    value: function(bits) {
      if (!(this instanceof Array) || this.length != 2) {
        throw 'Malformed Array -- ROTL';
      } else if (bits < 0) {
        throw 'Cannot rotate negative bits.';
      }

      if (this[0] == 0 && this[1] == 0)
        return this;

      var high_shifted = (this[0] << bits) >>> 0,
          high_rotated = (this[0] >>> (32 - bits)) >>> 0;

      var low_shifted = (this[1] << bits) >>> 0,
          low_rotated = (this[1] >>> (32 - bits)) >>> 0;

      var high = (high_shifted | low_rotated) >>> 0,
          low = (low_shifted | high_rotated) >>> 0;

      return [high, low];
    }
  });


  //
  // ROTR
  //
  Object.defineProperty(Array.prototype, 'rotr', {
    value: function(bits) {
      if (!(this instanceof Array) || this.length != 2) {
        throw 'Malformed Array -- ROTR';
      } else if (bits < 0) {
        throw 'Cannot rotate negative bits.';
      }

      if (this[0] == 0 && this[1] == 0)
        return this;

      var high_shifted = this[0] >>> bits,
          high_rotated = (this[0] << (32 - bits)) >>> 0;

      var low_shifted = this[1] >>> bits,
          low_rotated = (this[1] << (32 - bits)) >>> 0;

      var high = (high_shifted | low_rotated) >>> 0,
          low = (low_shifted | high_rotated) >>> 0;

      return [high, low];
    }
  });


  //
  // Shift Left
  //
  Object.defineProperty(Array.prototype, 'shiftl', {
    value: function(bits) {
      if (!(this instanceof Array) || this.length != 2) {
        throw 'Malformed Array -- Shift Left';
      } else if (bits < 0) {
        throw 'Cannot shift negative bits.';
      }

      var data = this;

      if (this[0] == 0 && this[1] == 0)
        return this;

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
  });


  //
  // Shift Right
  //
  Object.defineProperty(Array.prototype, 'shiftr', {
    value: function(bits) {
      if (!(this instanceof Array) || this.length != 2) {
        throw 'Malformed Array -- Shift Right';
      } else if (bits < 0) {
        throw 'Cannot shift negative bits.';
      }

      var data = this;

      if (this[0] == 0 && this[1] == 0)
        return this;

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
  });

  //-----------------------------------------------------------------
  //
  // Mathematical Functions
  //
  //-----------------------------------------------------------------

  //
  // Add
  //
  Object.defineProperty(Array.prototype, 'add', {
    value: function(b) {
      if (!(this instanceof Array) || !(b instanceof Array) ||
          this.length != 2 || b.length != 2) {
        throw 'Malformed Array -- Add';
      }

      if (this[0] == 0 && this[1] == 0) return b;
      if (b[0] == 0 && b[1] == 0) return this;

      var low = (this[1] + b[1]);
      var carry = low > 0xFFFFFFFF ? (Math.floor(low / Math.pow(2,32)) >>> 0) : 0;
      var high = (this[0] + b[0] + carry);

      return [(high >>> 0), (low >>> 0)];
    }
  });


  //
  // Subtract
  //
  Object.defineProperty(Array.prototype, 'subtract', {
    value: function(b) {
      if (!(this instanceof Array) || !(b instanceof Array) ||
          this.length != 2 || b.length != 2) {
        throw 'Malformed Array -- Subtract';
      }

      if (this[0] == 0 && this[1] == 0) return [0, 0];
      if (b[0] == 0 && b[1] == 0) return this;

      var high = 0, low = 0;
      low = (this[1] - b[1]);
      high = this[0] - b[0];

      if ((low >>> 0) > 0xFFFFFFFF || low < 0) {
        if (this[0] == 0 && low < 0) { return [0, 0]; }

        if (low > 0) high -= low;
        else if (low == -1) high += low;
        else high -= (low >>> 0);
      }

      return [high >>> 0, low >>> 0];
    }
  });


  //
  // Multiply
  //
  Object.defineProperty(Array.prototype, 'multiply', {
    value: function(b) {
      if (!(this instanceof Array) || !(b instanceof Array) ||
          this.length != 2 || b.length != 2) {
        throw 'Malformed Array -- Multiply';
      }

      var a = [this[0] >>> 16, 
           this[0] & 0xffff, 
           this[1] >>> 16, 
           this[1] & 0xffff];

      b = [b[0] >>> 16,
           b[0] & 0xffff,
           b[1] >>> 16, 
           b[1] & 0xffff];

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
  });

  //
  // Divide
  //
  Object.defineProperty(Array.prototype, 'divide', {
    value: function(divisor) {
      if (!(this instanceof Array) || !(divisor instanceof Array) ||
          this.length != 2 || divisor.length != 2) {
        throw 'Malformed Array -- Divide';
      }

      if (divisor.eql([0,0])) {
        throw "Divide by Zero";
      } else if (divisor.gt(this)) {
        return {quotient: [0,0], remainder: this};
      } else if (divisor.eql(this)) {
        return {quotient: [0, 1], remainder: [0,0]};
      }


      // if dividing by a power of two, just shift
      if( divisor.and(divisor.subtract([0,1])).eql([0,0]) ) {
        var shift_by = divisor.log2();
        var result = this.shiftr(shift_by);
        return { quotient:result, remainder:[0,0] };
      }

      // if dividing by less than 0xFFFFFFFF, just use integer division
      if (divisor.log2() <= 32) {
        var high = (this[0] >>> 0);
        var low = (this[1] >>> 0);
        var div = (divisor[1] >>> 0);

        var div_high = Math.floor(high / div);

        var div_low = (low / div);
        div_low += ((((high % div) * Math.pow(2, 32)) / div));

        var result = [div_high, Math.floor(div_low)];
        var diff = (((high % div) * (Math.pow(2, 32) % div)) + low) % div;

        return {quotient: result, remainder: [0, diff]};
      }

      // otherwise shift and subtract
      var dividend = this.slice();
      var max_bits = this.log2();
      var quotient = [0,0], remainder = [0,0], difference = [0,0];

      var i = max_bits;
      var shifted = [0,0];
      while (i >= 0 && dividend.gt([0,0])) {
        if (dividend.gte(divisor)) {
          quotient = quotient.add([0,1]);
          dividend = dividend.subtract(divisor);
        } else {
          shifted = this.slice().shiftr(--i);
          dividend = dividend.shiftl(1).or( shifted.and([0,1]) );
        }
      }

      return {quotient: quotient, remainder: remainder};
    }
  });

  
  Object.defineProperty(Array.prototype, 'log2', {
    value: function() {
      if (!(this instanceof Array) || this.length != 2) {
        throw 'Malformed Array -- Log2';
      }

      var v = this.slice();
      var b = [ [0,0x2], [0,0xC], [0,0xF0], [0,0xFF00], [0,0xFFFF0000], [0xFFFFFFFF, 0] ];
      var s = [1, 2, 4, 8, 16, 32];
      var i;
      
      var r = [0,0];
      for (i = 5; i >= 0 && !v.eql([0,0]); i--)
      {
        if (v.and(b[i]).gt([0,0]))
        {
          v = v.shiftr(s[i]);
          r = r.or([0,s[i]]);
        } 
      }

      return r.gte([0, 31]) ? r.add([0, 1])[1] : r[1];
    }
  });

  Object.defineProperty(Array.prototype, 'eql', {
    value: function(other) {
      if (!(this instanceof Array) || !(other instanceof Array) ||
          this.length != 2 || other.length != 2) {
        throw 'Malformed Array -- Equal';
      }

      return (this[0] === other[0] && this[1] === other[1]);
    }
  });


  Object.defineProperty(Array.prototype, 'gt', {
    value: function(other) {
      if (!(this instanceof Array) || !(other instanceof Array) ||
          this.length != 2 || other.length != 2) {
        throw 'Malformed Array -- Greater Than';
      }

      return (this[0] > other[0] || (this[1] > other[1] && this[0] >= other[0]));
    }
  });


  Object.defineProperty(Array.prototype, 'gte', {
    value: function(other) {
      if (!(this instanceof Array) || !(other instanceof Array) ||
          this.length != 2 || other.length != 2) {
        throw 'Malformed Array -- Greater Than or Equal';
      }

      if ( this[0] > other[0] ) return true;
      if ( this[0] == other[0] ) {
        if ( this[1] >= other[1] ) return true;
      }
      return false;
    }
  });


  Object.defineProperty(Array.prototype, 'lt', {
    value: function(other) {
      if (!(this instanceof Array) || !(other instanceof Array) ||
          this.length != 2 || other.length != 2) {
        throw 'Malformed Array -- Less Than';
      }

      return (this[0] < other[0] || (this[1] < other[1] && this[0] <= other[0]));
    }
  });


  Object.defineProperty(Array.prototype, 'lte', {
    value: function(other) {
      if (!(this instanceof Array) || !(other instanceof Array) ||
          this.length != 2 || other.length != 2) {
        throw 'Malformed Array -- Less Than or Equal';
      }

      if ( this[0] < other[0] ) return true;
      if ( this[0] == other[0] ) {
        if ( this[1] <= other[1] ) return true;
      }
      return false;
    }
  });


  //-----------------------------------------------------------------
  //
  // Formatting Functions
  //
  //-----------------------------------------------------------------

  Object.defineProperty(Array.prototype, 'hex', {
    value: function() {
      if (this.length < 2 || this.length > 2) return '';
      var high = this[0] > 0 ? this[0].toString(16).toUpperCase() : '';
      var low = this[1] > 0 ? this[1].toString(16).toUpperCase() : '00000000';
      for (var i = high.length; i < 8; i++) { high = '0' + high; }
      for (var m = low.length; m < 8; m++) { low = '0' + low; }
      return high + '' + low;
    }
  });


  Object.defineProperty(Array.prototype, 'string', {
    value: function() {
      if (this.length < 2 || this.length > 2) return '';

      var parts = '';
      var result = '';
      var iterator = this.slice();
      while (iterator.gt([0,0])) {
        parts = iterator.divide([0, 10]);
        iterator = parts.quotient;
        result = parseInt(parts.remainder[1], 10) + result;
      }

      return result;
    }
  });

  module.exports = eightbyte;

})();
