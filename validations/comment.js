const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateCommentInput(data) {
    let errors = {}

    data.content = isEmpty(data.content) ? '' : data.content

    

    if(!validator.isLength(data.content, {min: 2, max: 300})){
        errors.content = 'Comment content field must be between 2 and 300 characters.'
    }

    if(validator.isEmpty(data.content)){
        errors.content = 'Comment content field is required'
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }
}