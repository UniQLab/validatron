module.exports = {
	NO_PROPERTY_SUPPLIED: {
		priority: 0,
		name: 'NO_PROPERTY_SUPPLIED',
		status: 401,
		innerCode: 2,
		message: 'No property name was supplied for validation'
	},
	NOT_EXISTS: {
		priority: 1,
		name: 'NOT_EXISTS',
		status: 401,
		innerCode: 1,
		message: 'The property doesn\t exist'
	},

	INVALID_TYPE: {
		priority: 2,
		name: 'INVALID_TYPE',
		status: 401,
		innerCode: 3,
		message: 'The supplied property type is NaN'
	},

	INCORRECT_TYPE: {
		priority: 2,
		name: 'INCORRECT_TYPE',
		status: 401,
		innerCode: 4,
		message: 'The supplied property has incorrect type'
	},

	TOO_SHORT: {
		priority: 3,
		name: 'TOO_SHORT',
		status: 401,
		innerCode: 5,
		message: 'The supplied property has a too small length'
	},

	OUT_OF_RANGE: {
		priority: 3,
		name: 'OUT_OF_RANGE',
		status: 401,
		innerCode: 5,
		message: 'The supplied property has a too small length'
	},

	IS_NOT_EQUAL: {
		priority: 3,
		name: 'IS_NOT_EQUAL',
		status: 401,
		innerCode: 6,
		message: 'The two properties are not equal'
	},

	CUSTOM_ERROR: {
		priority: 4,
		name: 'CUSTOM_ERROR',
		status: 401,
		innerCode: 7
	}
};