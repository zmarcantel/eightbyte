Eightbyte
===============

Javascript does not contain 64 bit operations....

Instead, the standard complies to a 64 bit floating point representation that gives 58 bits of precision in integers.

The functions include:
  * `make(string)`    :: Create long from hex string (0x optional)
  * `and(a, b)`       :: Logical AND
  * `or(a, b)`        :: Logical OR
  * `xor(a, b)`       :: Logical XOR
  * `add(a, b)`       :: Addition
  * `multiply(a, b)`  :: Multiplication
  * `shiftr(a, bits)` :: Shift right
  * `shiftl(a, bits)` :: Shift left
  * `rotl(a, bits)`   :: Rotate left
  * `where (a) or (b) are a 64 bit integer of format [nHigh, nLow]`

### Usage

````js
var long = require('eightbyte');

var valid = long.make('0xDEADBEEF01010101').eql(long.make('DEADBEEF01010101'));

var anded = long.and([0x00, 0x01], [0x01, 0x00]),
    anded_hex = anded.hex();

var ored = long.or([0x00, 0x01], [0x01, 0x00]),
    ored_hex = ored.hex();

var xored = long.xor([0x00, 0x01], [0x01, 0x00]),
    xored_hex = xored.hex();

var added = long.add([0xAABBCCDD, 0x0011FFEE], [0x00112233, 0x44556677]),
    added_hex = added.hex();

var mult = long.multiply([0xAABBCCDD, 0x0011FFEE], [0x00112233, 0x44556677]),
    mult_hex = mult.hex();

var shiftr = long.shiftr([0xAABBCCDD, 0x0011FFEE], 2),
    shiftr_hex = shiftr.hex();

var shiftl = long.shiftl([0xAABBCCDD, 0x0011FFEE], 16),
    shiftl_hex = shiftl.hex();

var rotl = long.rotl([0xAABBCCDD, 0x0011FFEE], 2),
    rotl_hex = rotl.hex();

var rotr = long.rotr([0xAABBCCDD, 0x0011FFEE], 2),
    rotr_hex = rotr.hex();
````

### Formating

By default, the functions return the array representation of the long ([32bit, 32bit]).

For `hex` formatting, use:

    // returns 16 character hex representation as a string
    var long = require('eightbyte');
    var string_hex = long.add(first_long, second_long).hex();


Testing
===============

Install `mocha` and `should` using

    npm install --dev

Note: `npm 1.2.18` contains a bug that tries to install the development version of all devDependencies. Omit the `--dev` option and it should work correctly.

Once everything is installed:

    make test
