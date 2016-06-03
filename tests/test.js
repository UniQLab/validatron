const chai = require('chai');
chai.should();
const expect = chai.expect;


const ValidatorsGenerator = require('./../lib/validatorsGenerator');
const priorityList = require('./../lib/config/priorityList');
const errorsList = require('./../lib/config/errorsConf');
const typeUtils = require('./../lib/utils/typeUtils');

const num = 5;
const string = "Some string!";
const someArray = ['a', 'b', 'c', 'd', 'f'];
const someObj = { a: 130 };
const date = new Date();
const someFunc = function () {};

const notANumber = NaN;
const undefinedValue = undefined;
const nullValue = null;

const ValidationService = ValidatorsGenerator.createValidator({errorsList, priorityList, env: 'prod'});

const validationService = ValidationService.init(
	{number1: 5, string1: 'str1', object1: {val1: 1, innerObj: {val2: 2}}, array1: ['a', 3, new Date()], someDate1: new Date(), undef: undefined, nullValue: null, nanValue: NaN, func: someFunc},
	{number2: 6, string2: 'str2', object2: {val2: 2}, array2: ['b', 9999], someDate2: new Date() + 100},
	{number3: 7, string3: 'str3', object3: {val3: 3}, array3: [{}, 'c', 1, 5], someDate3: new Date() + 200}
);

describe('Validation utils', function () {

	describe('Validation utils add', function () {
		it('Should throw error if no value was supplied', function () {
			try {
				validationService.add('').validate();
			} catch (e) {
				e.should.have.property('message').equal('No property name was supplied to validate!');
			}
		});

		it('Should return INVALID_TYPE', function () {
			const result = validationService
				.add('nanValue')
				.validate();

			result.should.have.property('innerCode').equals(3);
		});

		it('Should return null if everything is okey', function () {
			const result = validationService
				.add('number1')
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils exist', function () {
		it('Should return NOT_EXISTS', function () {
			const result = validationService
				.add('some_unbelieveable_value')
				.exist()
				.validate();

			result.should.have.property('innerCode').equals(1);
		});

		it('Should return null', function () {
			const result = validationService
				.add('number1')
				.exist()
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils equals', function () {
		it('Should return IS_NOT_EQUAL', function () {
			const result = validationService
				.add('number1')
				.equal(6)
				.validate();

			result.should.have.property('innerCode').equals(6);
		});

		it('Should return null, while testing scalar values', function () {
			const result = validationService
				.add('number1')
				.equal(5)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return null, while testing deep objects', function () {
			const result = validationService
				.add('object1')
				.equal({val1: 1, innerObj: {val2: 2}})
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils type', function () {
		it('Should return INCORRECT_TYPE', function () {
			const result = validationService
				.add('number1').should.have.type('String') //Error here
				.add('number1').should.have.type('Number')
				.add('string1').should.have.type('String')
				.add('object1').should.have.type('Object')
				.add('array1').should.have.type('Array')
				.add('someDate1').should.have.type('Date')
				.validate();

			result.should.have.property('innerCode').equals(4);
		});

		it('Should return null', function () {
			const result = validationService
				.add('number1').should.have.type('Number')
				.add('string1').should.have.type('String')
				.add('object1').should.have.type('Object')
				.add('array1').should.have.type('Array')
				.add('someDate1').should.have.type('Date')
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils less', function () {
		it('Should return INVALID_TYPE', function () {
			const result = validationService
				.add('object1').should.be.less(10)
				.validate();

			result.should.have.property('innerCode').equals(3);
		});

		it('Should return OUT_OF_RANGE with number type', function () {
			const result = validationService
				.add('number1').should.be.less(5)
				.add('number1').should.be.less(3)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with number type', function () {
			const result = validationService
				.add('number1').should.be.less(6)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return OUT_OF_RANGE with string type', function () {
			const result = validationService
				.add('string1').should.be.less(2)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with string type', function () {
			const result = validationService
				.add('string1').should.be.less(5)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return OUT_OF_RANGE with array type', function () {
			const result = validationService
				.add('array1').should.be.less(2)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with array type', function () {
			const result = validationService
				.add('array1').should.be.less(5)
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils greater', function () {
		it('Should return INVALID_TYPE', function () {
			const result = validationService
				.add('object1').should.be.greater(10)
				.validate();

			result.should.have.property('innerCode').equals(3);
		});

		it('Should return OUT_OF_RANGE with number type', function () {
			const result = validationService
				.add('number1').should.be.greater(10)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with number type', function () {
			const result = validationService
				.add('number1').should.be.greater(1)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return OUT_OF_RANGE with string type', function () {
			const result = validationService
				.add('string1').should.be.greater(10)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with string type', function () {
			const result = validationService
				.add('string1').should.be.greater(2)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return OUT_OF_RANGE with array type', function () {
			const result = validationService
				.add('array1').should.be.greater(10)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with array type', function () {
			const result = validationService
				.add('array1').should.be.greater(1)
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils rangeOf', function () {
		it('Should return INVALID_TYPE', function () {
			const result = validationService
				.add('object1').should.be.in.rangeOf(2, 10)
				.validate();

			result.should.have.property('innerCode').equals(3);
		});

		it('Should return OUT_OF_RANGE with number type', function () {
			const result = validationService
				.add('number1').should.be.in.rangeOf(10, 100)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with number type', function () {
			const result = validationService
				.add('number1').should.be.in.rangeOf(1, 10)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return OUT_OF_RANGE with string type', function () {
			const result = validationService
				.add('string1').should.be.in.rangeOf(0, 1)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with string type', function () {
			const result = validationService
				.add('string1').should.be.in.rangeOf(2, 10)
				.validate();

			expect(result).to.be.null;
		});

		it('Should return OUT_OF_RANGE with array type', function () {
			const result = validationService
				.add('array1').should.be.in.rangeOf(50, 100)
				.validate();

			result.should.have.property('innerCode').equals(5);
		});

		it('Should return null with array type', function () {
			const result = validationService
				.add('array1').should.be.in.rangeOf(2, 5)
				.validate();

			expect(result).to.be.null;
		});
	});

	describe('Validation utils custom validation', function () {
		it('Should return INVALID_TYPE', function () {
			function testStringForNumber1(str) {
				return ~str.indexOf('1');
			}

			const result = validationService
				.add('string2').should.pass.customValidation('Shit happens', testStringForNumber1)
				.validate();

			result.should.have.property('innerCode').equals(7);
		});

		it('Should return INVALID_TYPE', function () {
			function testStringForNumber1(str) {
				return ~str.indexOf('1');
			}

			const result = validationService
				.add('string1').should.pass.customValidation('Shit happens', testStringForNumber1)
				.validate();

			expect(result).to.be.null;
		});
	});

});


describe('Type utils', function () {
	it('Should be okey', function () {
		typeUtils.getType(num).should.be.equal('Number');
		typeUtils.getType(string).should.be.equal('String');
		typeUtils.getType(someArray).should.be.equal('Array');
		typeUtils.getType(someObj).should.be.equal('Object');
		typeUtils.getType(date).should.be.equal('Date');
		typeUtils.getType(someFunc).should.be.equal('Function');
		typeUtils.getType(notANumber).should.be.equal('NaN');
		typeUtils.getType(undefinedValue).should.be.equal('Undefined');
		typeUtils.getType(nullValue).should.be.equal('Null');
	});
});