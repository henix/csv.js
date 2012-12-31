# csv.js

A simple CSV parser in JavaScript for the browser (and nodejs)

## Features

* Parse CSV to 2-dimension String array
* Specify column names or use the first row as column names
* Custom delimeter, quote character and row delimeter

## Example

See [test.js](https://github.com/henix/csv.js/blob/master/test.js)

## Low-level API

### CSV.CSVParser(String str, Object options)

Construct a CSVParser. A CSVParser hold some parser states.

`options` is an object that can have 3 properties: 'delim', 'quote', 'rowdelim'

Example:

```js
var parser = new CSV.CSVParser('a\tb\tc', {delim:'\t',quote:'"',rowdelim:'\r\n'});
while (parser.hasNext()) {
	var row = parser.nextRow();
	// do something with row
}
```

Every time you call `nextRow`, the parser will parse next portion of input. This allows you parse only front part of a string with the remainder untouched. You can stop anywhere.

### boolean CSVParser.hasNext()

### String[] CSVParser.nextRow()

## High-level API

All high-level APIs are implemented by the low-level API in a few lines. See bottom part of [csv.js](https://github.com/henix/csv.js/blob/master/csv.js)

### String[][] CSV.parse(String str, Object options)

### String[] CSV.parseOne(String str, Object options)

### Object[] CSV.bindColumns(String[][] rows, String[] columns)

If specified, use `columns` as column names. Otherwise use the first row.

## Dependency

* runtime: no
* test: nodejs

## Run test

	node test.js

## Performance Benchmark

[CSV.js vs jquery-csv](http://jsperf.com/csv-parsing-jquery-csv-and-csv-js)

## Compatibility

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
