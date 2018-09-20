const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatePostInput(data){

    let errors = {}

    data.content = isEmpty(data.content) ? '' : data.content

    if(validator.isEmpty(data.content)){
        errors.content = 'Post content is required'
    }

    if(!validator.isLength(data.content, {min: 2, max: 500})){
        errors.content = 'Post content must be between 2 and 500 characters'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}