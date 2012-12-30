/**
 * csv.js
 *
 * https://github.com/henix/csv.js
 *
 * License: MIT License
 */
var CSV = {
	DefaultOptions: {
		delim: ',',
		quote: '"',
		rowdelim: '\n'
	}
};

(function() {

function CSVSyntaxError(msg) {
	this.message = msg;
	if (Error.captureStackTrace) {
		Error.captureStackTrace(this, arguments.callee);
	}
}
CSVSyntaxError.prototype = new Error();
CSVSyntaxError.prototype.constructor = CSVSyntaxError;
CSVSyntaxError.prototype.name = 'CSVSyntaxError';

function CSVParser(str, options) {
	this.str = str;
	this.options = CSV.DefaultOptions;
	if (options) {
		options.delim = options.delim || CSV.DefaultOptions.delim;
		options.quote = options.quote || CSV.DefaultOptions.quote;
		options.rowdelim = options.rowdelim || CSV.DefaultOptions.rowdelim;
		this.options = options;
	}

	this.pos = 0;
	this.endpos = str.length;

	this.lineNo = 1;
}

CSVParser.prototype.next = function(s) {
	if (this.pos < this.endpos) {
		var len = s.length;
		if (this.str.substring(this.pos, this.pos + len) == s) {
			this.pos += len;
			return true;
		}
	}
	return false;
};

CSVParser.prototype.ahead = function(s) {
	if (this.pos < this.endpos) {
		var len = s.length;
		if (this.str.substring(this.pos, this.pos + len) == s) {
			return true;
		}
	}
	return false;
};

CSVParser.prototype.nextAny = function() {
	if (this.pos <= this.endpos) {
		this.pos++;
		return true;
	}
	return false;
};

CSVParser.prototype.charInQuote = function(s) {
	var mark = this.pos;
	if (!this.ahead(this.options.quote)) {
		if (this.nextAny()) {
			if (this.str.charAt(this.pos - 1) == '\n') {
				this.lineNo++;
			}
			return true;
		}
	} else if (this.next(this.options.quote + this.options.quote)) {
		return true;
	}
	this.pos = mark;
	return false;
};

CSVParser.prototype.quotedField = function() {
	var mark = this.pos;
	if (!this.next(this.options.quote)) { this.pos = mark; return null; }
	var begin = this.pos;
	while (this.charInQuote()) ;
	if (!this.next(this.options.quote)) { this.pos = mark; return null; }
	return this.str.substring(begin, this.pos - 1).replace(this.options.quote + this.options.quote, this.options.quote);
};

CSVParser.prototype.normalField = function() {
	var begin = this.pos;
	while (!(this.ahead(this.options.delim) || this.ahead(this.options.rowdelim)) && this.nextAny()) ;
	return this.str.substring(begin, this.pos);
};

CSVParser.prototype.nextField = function() {
	var tmp = this.quotedField();
	if (tmp !== null) return tmp;
	return this.normalField();
};

CSVParser.prototype.nextRow_0 = function() {
	var mark = this.pos;
	if (!this.next(this.options.delim)) { this.pos = mark; return null; }
	var tmp = this.nextField();
	if (tmp === null) { this.pos = mark; return null; }
	return tmp;
};

/**
 * @return String[]
 * @throws CSVSyntaxError
 */
CSVParser.prototype.nextRow = function() {
	var ar = [];
	var mark = this.pos;
	var tmp = this.nextField();
	if (tmp === null) { this.pos = mark; return null; }
	ar.push(tmp);
	tmp = this.nextRow_0();
	while (tmp !== null) {
		ar.push(tmp);
		tmp = this.nextRow_0();
	}
	if (!(this.next(this.options.rowdelim) || !this.ahead(''))) { throw new CSV.CSVSyntaxError('line ' + this.lineNo + ': ' + this.str.substring(Math.max(this.pos - 5, 0), this.pos + 5)); this.pos = mark; return null; }
	if (this.str.charAt(this.pos - 1) == '\n') {
		this.lineNo++;
	}
	return ar;
};

/**
 * @return boolean
 */
CSVParser.prototype.hasNext = function() {
	return this.ahead('');
};

CSV.CSVSyntaxError = CSVSyntaxError;
CSV.CSVParser = CSVParser;

/**
 * @return String[] or null
 */
CSV.parseOne = function(str, options) {
	var parser = new CSV.CSVParser(str, options);
	if (parser.hasNext()) {
		return parser.nextRow();
	}
	return null;
};

/**
 * @return String[][]
 */
CSV.parse = function(str, options) {
	var parser = new CSVParser(str, options);
	var all = [];
	while (parser.hasNext()) {
		var ar = parser.nextRow();
		all.push(ar);
	}
	return all;
};

/**
 * @param rows String[][]
 * @param colnames String[]
 * @return Object[]
 */
CSV.bindColumns = function(rows, colnames) {
	if (!colnames) {
		colnames = rows.shift();
	}
	return rows.map(function(row) {
		var obj = {};
		for (var i = 0; i < row.length; i++) {
			obj[colnames[i]] = row[i];
		}
		return obj;
	});
};

/**
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
 */
if (!Array.prototype.map) {
	Array.prototype.map = function(callback, thisArg) {
		var T, A, k;
		if (this === null) {
			throw new TypeError(" this is null or not defined");
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if ({}.toString.call(callback) != "[object Function]") {
			throw new TypeError(callback + " is not a function");
		}
		if (thisArg) {
			T = thisArg;
		}
		A = new Array(len);
		k = 0;
		while(k < len) {
			var kValue, mappedValue;
			if (k in O) {
				kValue = O[ k ];
				mappedValue = callback.call(T, kValue, k, O);
				A[ k ] = mappedValue;
			}
			k++;
		}
		return A;
	};
}

// exports
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = CSV;
	}
} else if (typeof define === 'function') {
	define('CSV', function () {
		return CSV;
	});
}

})();
