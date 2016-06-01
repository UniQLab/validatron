'use strict';

const _ = require('underscore');

module.exports = {
	getType(value) {
		if (_.isArray(value)) return 'Array';
		if (_.isDate(value)) return 'Date';
		if (_.isFunction(value)) return 'Function';
		if (_.isObject(value)) return 'Object';

		if (_.isNull(value)) return 'Null';
		if (_.isNaN(value)) return 'NaN';
		if (_.isUndefined(value)) return 'Undefined';

		if (_.isNumber(value)) return 'Number';
		if (_.isBoolean(value)) return 'Boolean';
		if (_.isString(value)) return 'String';
	},

	isInvalidType(type) {
		switch (type) {
			case 'Null': return true;
			case 'NaN': return true;
			case 'Undefined': return true;
			default: return false;
		}
	}
};