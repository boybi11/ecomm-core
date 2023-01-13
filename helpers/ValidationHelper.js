const revalidator = require('revalidator')

exports.validate = function (object, schema, options){
	let errors = {}
	let validation = revalidator.validate(object, schema, options)
	if (!validation.valid) {

		validation.errors.forEach((error) => {
			errors[error.property] = `${error.message}`
		})
	}

	return {
		valid: validation.valid,
		errors: errors
	}
}
