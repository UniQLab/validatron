'use strict';

const Console = require('console').Console;

const ValidationService = require('./validationService');

class ValidatorsGenerator {
	constructor() {
		throw new Error('Can\'t instantiate ValidationGenerator through constructor. Use ValidatorsGenerator.createValidator() instead');
	}

	static createValidator(options) {
		const { priorityList, errorsList } = options;
		let { errorLogger, noticeLogger } = options;

		if (!errorLogger) errorLogger = console.error.bind(Console);
		if (!noticeLogger) noticeLogger = console.log.bind(Console);

		ValidationService.priorityList = priorityList;
		ValidationService.errorsList = errorsList;
		ValidationService.logError = errorLogger;
		ValidationService.log = noticeLogger;
		ValidationService.env = options.env || 'dev';
		
		return ValidationService;
	}
}

module.exports = ValidatorsGenerator;