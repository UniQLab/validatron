'use strict';

const _ = require('underscore');

const Shouder = require('./shouder');
const typeUtils = require('./typeUtils');

class ValidationService extends Shouder {

	static init(query, body, params) {
		return new this(query, body, params);
	}

	constructor(query = {}, body = {}, params = {}) {
		super();

		if (!ValidationService.errorsList) throw new Error('errorsList is not present!');
		if (!ValidationService.priorityList) throw new Error('priorityList is not present!');

		this.elements = _.extendOwn(query, body, params);

		this.error = null;
		this.currentProperty = {};
	}
	
	_setError(errorType, message) {
		const error = this.constructor.errorsList[errorType];

		if (!error) throw new Error('No such error type!');
		if (message) error.message = message;
		if (this._shouldBeLogged()) this._logError(error);
		if (this._shouldSetError()) this.error = error;
	}

	_shouldBeLogged() {
		return this.constructor.env === ('dev' || 'test');
	}
	
	_shouldSetError() {
		return !this.error;
	}

	_shouldBreakThrough() {
		return (!this._shouldBeLogged() && !this._shouldSetError());
	}

	_logError(error) {
		this.constructor.logError(error);
	}

	/**
	 * Добавляет свойство для валидации
	 *
	 * @param propertyName {String} - название свойства
	 */
	add(propertyName) {
		if (!propertyName) throw new Error('No property name was supplied to validate!');
		if (this._shouldBreakThrough()) return this;

		this.currentProperty = {};

		const propertyValue = this.elements[propertyName];
		const type = typeUtils.getType(propertyValue);
		const isInvalid = _.isNaN(propertyValue);

		if (!isInvalid) {
			this.currentProperty.name = propertyName;
			this.currentProperty.value = propertyValue;
			this.currentProperty.type = type;
		} else {
			const message = `Property ${propertyName} is NaN`;
			this._setError('INVALID_TYPE', message);
		}
		
		return this;
	}
	
	exist() {
		if (this._shouldBreakThrough()) return this;
		if (!this.currentProperty.value) {
			const message = `Property ${this.currentProperty.name} was not supplied!`;
			this._setError('NOT_EXISTS', message)
		}
		return this;
	}

	type(suppliedType) {
		if (this._shouldBreakThrough()) return this;
		const realType = this.currentProperty.type;
		if (suppliedType !== realType) {
			const message = `Property ${this.currentProperty.name} with value ${this.currentProperty.value} has type ${realType}, not ${suppliedType}`;
			this._setError('INCORRECT_TYPE', message);
		}
		
		return this;
	}
	
	less(num) {
		if (this._shouldBreakThrough()) return this;

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

		
		if (outOfRangeMessage) this._setError('OUT_OF_RANGE', outOfRangeMessage);
		if (invalidTypeError) this._setError('INVALID_TYPE', invalidTypeError);
		
		return this;
	}
	
	greater(num) {
		if (this._shouldBreakThrough()) return this;

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


		if (outOfRangeMessage) this._setError('OUT_OF_RANGE', outOfRangeMessage);
		if (invalidTypeError) this._setError('INVALID_TYPE', invalidTypeError);

		return this;
	}
	
	rangeOf(num1, num2) {
		if (this._shouldBreakThrough()) return this;

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


		if (outOfRangeMessage) this._setError('OUT_OF_RANGE', outOfRangeMessage);
		if (invalidTypeError) this._setError('INVALID_TYPE', invalidTypeError);

		return this;
	}
	
	customValidation(messageIfError, validatorFunc) {
		if (this._shouldBreakThrough()) return this;
		
		const value = this.currentProperty.value;
		const valid = validatorFunc(value);
		
		if (!valid)  this._setError('CUSTOM_ERROR', messageIfError);

		return this;
	}

	equal(suppliedValue) {
		if (this._shouldBreakThrough()) return this;

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
			var message = `Property ${name} with value ${value} is not equal to ${suppliedValue}`;
			this._setError('IS_NOT_EQUAL', message);
		}

		return this;
	}
	
	validate() {
		const error = this.error;
		this.error = null;
		this.currentProperty = {};
		return error;
	}
}

module.exports = ValidationService;