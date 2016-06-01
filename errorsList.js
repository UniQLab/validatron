module.exports = {
	NOT_EXISTS: {
		status: 400,
		innerCode: 1,
		message: 'The property doesn\t exist'
	},
	
	NO_PROPERTY_SUPPLIED: {
		status: 400,
		innerCode: 2,
		message: 'No property name was supplied for validation'
	},

	INVALID_TYPE: {
		status: 400,
		innerCode: 3,
		message: 'The supplied property type is NaN'
	},

	INCORRECT_TYPE: {
		status: 400,
		innerCode: 4,
		message: 'The supplied property has incorrect type'
	},

	TOO_SHORT: {
		status: 400,
		innerCode: 5,
		message: 'The supplied property has a too small length'
	},

	OUT_OF_RANGE: {
		status: 400,
		innerCode: 5,
		message: 'The supplied property has a too small length'
	},

	IS_NOT_EQUAL: {
		status: 400,
		innerCode: 6,
		message: 'The two properties are not equal'
	},

	CUSTOM_ERROR: {
		status: 400,
		innerCode: 7
	}
};