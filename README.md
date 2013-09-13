Eightbyte
===============

Javascript does not contain 64 bit operations....

Instead, the standard complies to a 64 bit floating point representation that gives 58 bits of precision in integers.

The functions include:
  * `make(string)`    :: Create 0x optional)
  * `and(b)`          :: Logical AND
  * `or(b)`           :: Logical OR
  * `xor(b)`          :: Logical XOR
  * `add(b)`          :: Addition
  * `subtract(b)`     :: Subtraction
  * `multiply(b)`     :: Multiplication
  * `divide(b)`       :: Division -> {quotient:x, remainder: y}
  * `shiftr(bits)`    :: Shift right
  * `shiftl(bits)`    :: Shift left
  * `rotl(bits)`      :: Rotate left
  * `rotr(bits)`      :: Rotate right
  * `log2()`          :: Log (base 2)
  * `hex()`           :: Hex representation
  * `string()`        :: String representation
  * `where (b) is a 64 bit integer of format [nHigh, nLow]`

### TODO

* Expanded Documentation
* Malformed error test on all operations
* Expanded tests

### Usage

````js
var 'eightbyte');

var valid = 'DEADBEEF01010101'));

var anded = [0x00, 0x01].and([0x01, 0x00]),
    anded_hex = anded.hex();

var ored = [0x00, 0x01].or([0x01, 0x00]),
    ored_hex = ored.hex();

var xored = [0x00, 0x01].xor([0x01, 0x00]),
    xored_hex = xored.hex();

var added = [0xAABBCCDD, 0x0011FFEE].add([0x00112233, 0x44556677]),
    added_hex = added.hex();

var subtracted = [0xAABBCCDD, 0x0011FFEE].subtract([0x00112233, 0x44556677]),
    subtracted_hex = subtracted.hex();

var mult = [0xAABBCCDD, 0x0011FFEE].multiply([0x00112233, 0x44556677]),
    mult_hex = mult.hex();

var divided = [0xAABBCCDD, 0x0011FFEE].divide([0x00112233, 0x44556677]),
    divided_hex = divided.hex();

var shiftr = [0xAABBCCDD, 0x0011FFEE].shiftr(2),
    shiftr_hex = shiftr.hex();

var shiftl = [0xAABBCCDD, 0x0011FFEE].shiftl(16),
    shiftl_hex = shiftl.hex();

var rotl = [0xAABBCCDD, 0x0011FFEE].rotl(2),
    rotl_hex = rotl.hex();

var rotr = [0xAABBCCDD, 0x0011FFEE].rotr(2),
    rotr_hex = rotr.hex();

var log2 = [0xAABBCCDD, 0x0011FFEE].log2(),
````

### Formating

By default, the functions return the array representation of the [32bit, 32bit]).

For `hex` formatting, use:

    // returns 16 character hex representation as a string
    var string_hex = [0xAABBCCDD, 0xEEFF0011].hex();
    // returns "AABBCCDDEEFF0011"

For `string` formatting, use:

    var string_value = [0xAABBCCDD, 0xEEFF0011].string();
    // returns "12302652060662169617"


Testing
===============

Install `mocha` and `should` using

    npm install --dev

Note: `npm 1.2.18` contains a bug that tries to install the development version of all devDependencies. Omit the `--dev` option and it should work correctly.

Once everything is installed:

    make test
