'use strict';

const _ = require('underscore');

const ShouldService = require('./shouldService');
const typeUtils = require('./../utils/typeUtils');

const basicErrors = require('../config/basicErrors');
const criticalErrors = require('../config/criticalErrors');

class ValidationService extends ShouldService {
	constructor(...objects) {
		super();

		this.elements = _.extendOwn(...objects);
		this.errors = _.create();
		this.currentProperty = {};
	}

	static init(...objects) {
		return new this(...objects);
	}

	/**
	 * Добавляет свойство для валидации
	 * @param propertyName {String} - название свойства
	 */
	add(propertyName) {
		if (!propertyName) throw new Error(criticalErrors.NO_PROPERTY_TO_VALIDATE);

		this.currentProperty = {};

		const propertyValue = this.elements[propertyName];
		const type = typeUtils.getType(propertyValue);
		const isInvalid = _.isNaN(propertyValue);

		this.currentProperty.name = propertyName;
		this.currentProperty.value = propertyValue;
		this.currentProperty.type = type;

		if (isInvalid) {
			const message = `Property ${propertyName} is NaN`;
			this._setError(basicErrors.INVALID_TYPE.name, message);
		}

		return this;
	}

	exist() {
		if (!this.currentProperty.value) {
			const message = `Property ${this.currentProperty.name} was not supplied!`;
			this._setError(basicErrors.NOT_EXISTS.name, message);
		}
		return this;
	}

	type(suppliedType) {
		const realType = this.currentProperty.type;
		if (suppliedType !== realType) {
			const message = `Property ${this.currentProperty.name} with value ${this.currentProperty.value} has type ${realType}, not ${suppliedType}`;
			this._setError(basicErrors.INCORRECT_TYPE.name, message);
		}

		return this;
	}

	less(num) {
		const name = this.currentProperty.name;
		const value = this.currentProperty.value;
		const type = this.currentProperty.type;
		let outOfRangeMessage = '';
		let invalidTypeError = '';

		switch (type) {
		case 'String':
		case 'Array':
			const length = value.length;
			if (length > num) outOfRangeMessage = `Property of type ${type} ${name} has length ${length} instead of < ${num}`;
			break;
		case 'Number':
			if (value > num) outOfRangeMessage = `Property of type ${type} ${name} has value ${value} instead of < ${num}`;
			break;
		default:
			invalidTypeError = `The value ${name} with type ${type} is not supposed to be less or greater`;
		}


		if (outOfRangeMessage) this._setError(basicErrors.OUT_OF_RANGE.name, outOfRangeMessage);
		if (invalidTypeError) this._setError(basicErrors.INVALID_TYPE.name, invalidTypeError);

		return this;
	}

	greater(num) {
		const name = this.currentProperty.name;
		const value = this.currentProperty.value;
		const type = this.currentProperty.type;
		let outOfRangeMessage = '';
		let invalidTypeError = '';

		switch (type) {
		case 'String':
		case 'Array':
			const length = value.length;
			if (length < num) outOfRangeMessage = `Property of type ${type} ${name} has length ${length} instead of > ${num}`;
			break;
		case 'Number':
			if (value < num) outOfRangeMessage = `Property of type ${type} ${name} has value ${value} instead of > ${num}`;
			break;
		default:
			invalidTypeError = `The value ${name} with type ${type} is not supposed to be less or greater`;
		}


		if (outOfRangeMessage) this._setError(basicErrors.OUT_OF_RANGE.name, outOfRangeMessage);
		if (invalidTypeError) this._setError(basicErrors.INVALID_TYPE.name, invalidTypeError);

		return this;
	}

	rangeOf(num1, num2) {
		const name = this.currentProperty.name;
		const value = this.currentProperty.value;
		const type = this.currentProperty.type;
		let outOfRangeMessage = '';
		let invalidTypeError = '';

		switch (type) {
		case 'String':
		case 'Array':
			const length = value.length;
			if (length < num1 || length > num2) outOfRangeMessage = `Property of type ${type} ${name} has length ${length}  which is not in range of ${num1} < length < ${num2}`;
			break;
		case 'Number':
			if (value < num1 || value > num2) outOfRangeMessage = `Property of type ${type} ${name} has value ${value} which is not in range of ${num1} < length < ${num2}`;
			break;
		default:
			invalidTypeError = `The value ${name} with type ${type} is not supposed to be less or greater`;
		}

		if (outOfRangeMessage) this._setError(basicErrors.OUT_OF_RANGE.name, outOfRangeMessage);
		if (invalidTypeError) this._setError(basicErrors.INVALID_TYPE.name, invalidTypeError);

		return this;
	}

	customValidation(messageIfError, validatorFunc) {
		const value = this.currentProperty.value;
		const valid = validatorFunc(value);

		if (!valid) this._setError('CUSTOM_ERROR', messageIfError);

		return this;
	}

	equal(suppliedValue) {
		const name = this.currentProperty.name;
		const value = this.currentProperty.value;
		const type = this.currentProperty.type;
		let isEqual = false;

		switch (type) {
		case 'Array':
		case 'Object':
			isEqual = _.isEqual(value, suppliedValue);
			break;
		default:
			isEqual = value === suppliedValue;
		}

		if (!isEqual) {
			const message = `Property ${name} with value ${value} is not equal to ${suppliedValue}`;
			this._setError(basicErrors.IS_NOT_EQUAL.name, message);
		}

		return this;
	}

	validate() {
		this._prioritize();
		const result = this._getFinalResult();
		this._wipeService();
		return result;
	}

	_shouldBeLogged() {
		return this.constructor.env === 'dev';
	}

	_logError(error) {
		this.constructor.logError(error);
	}

	_setError(errorType, message) {
		const error = this.constructor.errorsList[errorType];
		const propName = this.currentProperty.name;
		const isArray = _.isArray(this.errors[propName]);

		if (!error) throw new Error(criticalErrors.NO_SUCH_TYPE);
		if (message) error.message = message;
		if (this._shouldBeLogged()) this._logError(error);

		isArray ? this.errors[propName].push(error) : this.errors[propName] = [error];
	}

	_getErrorFields(errorObj) {
		if (ValidationService.errorFieldsToGet && _.isArray(ValidationService.errorFieldsToGet)) {
			return _.pick(errorObj, ValidationService.errorFieldsToGet);
		}

		return _.pick(errorObj, 'priority', 'status', 'innerCode', 'message');
	}

	_prioritize() {
		const errors = this.errors;

		for (const propertyName in errors) {
			errors[propertyName] = _.sortBy(errors[propertyName], singleError => singleError.priority);
		}
	}

	_mergeErrors() {
		let mergedArray = [];

		for (const key in this.errors) {
			mergedArray = _.union(mergedArray, this.errors[key]);
		}

		return mergedArray;
	}

	_getFinalResult() {
		const returnAllErrors = this.constructor.returnAllErrors;
		const mergedErrors = this._mergeErrors();

		if (!mergedErrors.length) return null;
		if (!returnAllErrors) return this._getErrorFields(mergedErrors[0]);

		return _.map(mergedErrors, error => this._getErrorFields(error));
	}

	_wipeService() {
		this.errors = null;
		this.currentProperty = {};
	}
}

module.exports = ValidationService;
