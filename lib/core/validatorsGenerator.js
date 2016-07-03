'use strict';

const { Console } = require('console');

const _ = require('underscore');

const ValidationService = require('./../services/validationService');
const errorsConf = require('./../config/basicErrors');
const errorPropertyList = require('./../config/errorPropertyList');
const criticalErrors = require('./../config/criticalErrors');

class ValidatorsGenerator {
	constructor() {
		throw new Error(criticalErrors.VALIDATOR_GENERATOR_CONSTRUCTOR_ERROR);
	}

	static _mergeConfigAndUserErrors(configErrors, userErrors = {}) {
		const resultingErrorsConf = _.clone(configErrors);

		for (const key in userErrors) {
			resultingErrorsConf[key] = _.extendOwn(resultingErrorsConf[key], userErrors[key]);

		}
		return resultingErrorsConf;
	}

	// static _getFinalPropertyList(propertyList) {
	// 	const isArray = _.isArray(propertyList);
	// 	const isUndefined = _.isUndefined(propertyList);
	//
	// 	if (!isArray && !isUndefined) throw new Error(criticalErrors.INVALID_PROPERTY_LIST_TYPE);
	// 	if (isUndefined) return errorPropertyList;
	//
	// 	return _.intersection(propertyList, errorPropertyList);
	// }

	static createValidator(options) {
		const { errorsList, errorFieldsToGet } = options;
		const { env = 'dev', returnAllErrors = false } = options;
		let { errorLogger, noticeLogger } = options;

		if (!errorLogger) errorLogger = console.error.bind(Console);
		if (!noticeLogger) noticeLogger = console.log.bind(Console);

		return ValidationService.configure({
			errorsList: this._mergeConfigAndUserErrors(errorsConf, errorsList),
			logError: errorLogger,
			log: noticeLogger,
			errorFieldsToGet,
			returnAllErrors,
			env
		});
	}
}

module.exports = ValidatorsGenerator;
