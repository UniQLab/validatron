'use strict';

const _ = require('underscore');
const typeConstants = require('../constants/typeConstants');

module.exports = {
	getType(value) {
		if (_.isArray(value)) return typeConstants.ARRAY;
		if (_.isDate(value)) return typeConstants.DATE;
		if (_.isFunction(value)) return typeConstants.FUNCTION;
		if (_.isObject(value)) return typeConstants.OBJECT;

		if (_.isNull(value)) return typeConstants.NULL;
		if (_.isNaN(value)) return typeConstants.NAN;
		if (_.isUndefined(value)) return typeConstants.UNDEFINED;

		if (_.isNumber(value)) return typeConstants.NUMBER;
		if (_.isBoolean(value)) return typeConstants.BOOLEAN;
		if (_.isString(value)) return typeConstants.STRING;
	},

	isInvalidType(type) {
		switch (type) {
		case typeConstants.NULL:
		case typeConstants.NAN:
		case typeConstants.UNDEFINED:
			return true;
		default: return false;
		}
	}
};
