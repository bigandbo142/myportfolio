const validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateProfileInput(data) {
    let errors = {}

    data.handle = isEmpty(data.handle) ? '' : data.handle
    data.bio = isEmpty(data.bio) ? '' : data.bio
    data.status = isEmpty(data.status) ? '' : data.status
    data.skills = isEmpty(data.skills) ? '' : data.skills

    if(validator.isEmpty(data.handle)){
        errors.handle = 'Handle field is required'
    }

    if(!validator.isLength(data.handle, {min: 2, max: 40})){
        errors.handle = 'Handle must be between 2 and 40 characters'
    }

    if(validator.isEmpty(data.bio)){
        errors.bio = 'Bio field is required'
    }

    if(validator.isEmpty(data.status)){
        errors.status = 'Status field is required'
    }

    if(validator.isEmpty(data.skills)){
        errors.skills = 'Skills field is required'
    }
    
    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            errors.website = 'Website URL is not valid'
        }
    }

    if(!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            errors.youtube = 'Youtube URL is not valid'
        }
    }

    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            errors.facebook = 'Facebook URL is not valid'
        }
    }

    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.twitter = 'Twitter URL is not valid'
        }
    }

    if(!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
            errors.linkedin = 'Linkedin URL is not valid'
        }
    }

    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            errors.instagram = 'Instagram URL is not valid'
        }
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }
}