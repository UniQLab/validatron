const ValidationGenerator = require('../');

const ValidationService = ValidationGenerator.createValidator({
	errorsList: {
		OUT_OF_RANGE: {
			someNewProperty: 'newProperty'
		}
	},
	env: 'prod',
	returnAllErrors: true,
	errorFieldsToGet: ['name', 'innerCode', 'someNewProperty']
});

const validationService = ValidationService.init(
	{number1: 5, string1: 'str1', object1: {val1: 1, innerObj: {val2: 2}}, array1: ['a', 3, new Date()], someDate1: new Date(), undef: undefined, nullValue: null, nanValue: NaN, func: function() {}},
	{number2: 6, string2: 'str2', object2: {val2: 2}, array2: ['b', 9999], someDate2: new Date() + 100},
	{number3: 7, string3: 'str3', object3: {val3: 3}, array3: [{}, 'c', 1, 5], someDate3: new Date() + 200}
);


const result = validationService
	.add('number1').should.be.in.rangeOf(10, 100).and.have.type('String')
	.add('string1').should.exist().and.have.type('String')
	.validate();

console.log(result);