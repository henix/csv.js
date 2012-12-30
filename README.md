# csv.js

A simple CSV parser in JavaScript for the browser (and nodejs)

## Example

See test.js

## Low-level API

### CSVParser(str, options)

contruct a CSVParser. A CSVParser hold some parser states.

options is an object that can have 3 properties: 'delim', 'quote', 'rowdelim'

### CSVParser.hasNext()

returns a boolean

### CSVParser.nextRow()

returns a String[]

## High-level API

For these APIs, see the javadoc in csv.js

### CSV.parse(str options)

### CSV.parseOne(str, options)

### CSV.bindColumns(rows, columns)

If specified, use `columns` as column names. Otherwise use the first row.

## Dependency

* runtime: no
* test: nodejs

## Run test

	node test.js

## Compatiblity

csv.js can be used with:

* browser
* nodejs
* AMD / CMD / require.js

## Standard compliance

This implementation is compliant to [RFC4180](http://tools.ietf.org/html/rfc4180), except for the default line delimeter: this implementation use `\n`, but RFC4180 states it should be `\r\n`.

Use the following code if you want strict RFC4180 behavior:

	CSV.DefaultOptions.rowdelim = '\r\n';

## Implementation Details

This is a PEG (Parsing Expression Grammar) parser, written in recursive descent style.

The PEG I use is taken from [lpeg's homepage](http://www.inf.puc-rio.br/~roberto/lpeg/):

```lua
field = '"' * ((lpeg.P(1) - '"') + lpeg.P'""')^0 * '"' +
		(1 - lpeg.S',\n"')^0
record = field * (',' * field)^0 * (lpeg.P'\n' + -1)
```
