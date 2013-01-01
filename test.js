if (typeof require !== 'undefined') {
	assert = require('assert');
	CSV = require('./csv.js');
} else {
	assert = QUnit.assert;
}

if (typeof test === 'undefined') {
	test = function(str, func) {
		func();
	};
}

test("all", function() {

// parse one row
assert.deepEqual(CSV.parseOne('a,b,c'), ['a','b','c']);

// custom delim
assert.deepEqual(CSV.parseOne('a\tb\tc', {delim:'\t'}), ['a','b','c']);

// parse multi rows
assert.deepEqual(CSV.parse('"1",Alice\n2,Bob'), [['1','Alice'],['2','Bob']]);

// empty line
assert.deepEqual(CSV.parse('1\n\n2'), [['1'], [''], ['2']]);

// bind columns
assert.deepEqual(CSV.bindColumns(CSV.parse('id,name\n1,Alice\n2,Bob')), [{id:'1', name:'Alice'}, {id: '2', name: 'Bob'}]);

// , in value
assert.deepEqual(CSV.parseOne('"1,2",3'), ['1,2', '3']);

// \n in value
assert.deepEqual(CSV.parse('"1\n2"\n3'), [['1\n2'],['3']]);

// " in value
assert.deepEqual(CSV.parseOne('"1""2",3'), ['1"2', '3']);
assert.deepEqual(CSV.parseOne('"""1""",3'), ['"1"', '3']);

// not well formatted
assert.deepEqual(CSV.parseOne('1"2,3'), ['1"2', '3']);

// syntax error
assert.throws(function() { CSV.parseOne('"1""'); }, CSV.CSVSyntaxError);

assert.throws(function() { CSV.parseOne('"1,\n2"",3'); }, /line 2:/);

assert.throws(function(){ CSV.parseOne('"1"2",3'); }, CSV.CSVSyntaxError);
assert.throws(function(){ CSV.parse('"a\nb",c\n"1"2",3'); }, /line 3:/);

});
