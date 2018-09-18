const express = require('express')
const router = express.Router()
const passport = require('passport')
const keys = require('../../configs/keys')

// validator for Profile input
const validateProfileInput = require('../../validations/profile')

// validator for Experience input
const validateExperienceInput = require('../../validations/experience')

// validator for Education input
const validateEducationInput = require('../../validations/education')

// load Profile schema
const Profile = require('../../models/Profile')

// load User schema
// const User = require('../../models/User')

// @route   api/profile/test
// @desc    Test profile api 
// type     GET
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from profile api'
}))

// @route   api/profile
// @desc    request profile of current user 
// type     GET
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {}

    Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'This user does not initialize profile'
                return res.status(404).json(errors)
            }

            res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})

// @route   api/profile
// @desc    create or update profile for user
// type     POST
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body)

    if(!isValid) return res.status(400).json(errors)

    const profileData = {}
    profileData.user = req.user.id
    // collect data from request
    if(req.body.handle) profileData.handle = req.body.handle
    if(req.body.company) profileData.company = req.body.company
    if(req.body.website) profileData.website = req.body.website
    if(req.body.location) profileData.location = req.body.location
    if(req.body.status) profileData.status = req.body.status

    // split skills string by comma
    if(typeof req.body.skills !== 'undefined'){
        profileData.skills = req.body.skills.split(',')
    }

    if(req.body.bio) profileData.bio = req.body.bio
    if(req.body.githubusername) profileData.githubusername = req.body.githubusername
    if(req.body.experiences) profileData.experiences = req.body.experiences
    if(req.body.educations) profileData.educations = req.body.educations

    // socials
    profileData.socials = {}
    if(req.body.youtube) profileData.socials.youtube = req.body.youtube
    if(req.body.twitter) profileData.socials.twitter = req.body.twitter
    if(req.body.facebook) profileData.socials.facebook = req.body.facebook
    if(req.body.linkedin) profileData.socials.linkedin = req.body.linkedin
    if(req.body.instagram) profileData.socials.instagram = req.body.instagram

    // check if user has profile
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(profile){ // update profile
                Profile.findOneAndUpdate({user: req.user.id}, {$set: profileData}, {new: true}, prof => res.json(prof))
            } else {
                // check if handle already exist
                Profile.findOne({handle: req.body.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists'
                            return res.status(400).json(errors)
                        }

                        // create new one
                        new Profile(profileData).save().then(prof => {
                            res.json(prof)
                        })
                    })
            }
        })
})

// @route   api/profile/handle/:handle
// @desc    get user profile through handle
// type     GET
// @access  Public
router.get('/handle/:handle', (req, res) => {
    const errors = {}

    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for that handle'
                return res.status(404).json(errors)
            }

            return res.json(profile)
        })
        .catch(err => {
            errors.noprofile = 'There is no profile for that handle'
            res.status(400).json(errors)
        })
})

// @route   api/profile/user/:user_id
// @desc    get user profile through user id
// type     GET
// @access  Public
router.get('/user/:user_id', (req, res) => {
    const errors = {}

    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for that handle'
                return res.status(404).json(errors)
            }

            return res.json(profile)
        })
        .catch(err => {
            errors.noprofile = 'There is no profile for that user id'
            res.status(400).json(errors)
        })
})

// @route   api/profile/all
// @desc    get all user profiles
// type     GET
// @access  Public
router.get('/all', (req, res) => {
    const errors = {}

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = 'There are no profiles'
                return res.status(404).json(errors)
            }

            return res.json(profiles)
        })
        .catch(err => {
            errors.noprofile = 'There are no profiles'
            res.status(400).json(errors)
        })
})


// @route   api/profile/experience
// @desc    add new experience to profile
// type     POST
// @access  Private
router.post('/experience', passport.authenticate('jwt', {session : false}), (req, res) => {

    const {errors, isValid} = validateExperienceInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {

            if(!profile){
                errors.noprofile = 'There is no profile for user'
                return res.status(404).json(errors)
            }

            let newExp = {
                title : req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // add new experience to array
            profile.experiences.unshift(newExp)

            profile.save()
                .then(prof => res.json(prof))
                .catch(err => {
                    errors.noprofile = 'There is no profile for user'
                    return res.status(400).json(errors)
                })
        })
        .catch(err => {
            errors.noprofile = 'There is no profile for user'
            return res.status(400).json(errors)
        })
})


// @route   api/profile/education
// @desc    add new education to profile
// type     POST
// @access  Private
router.post('/education', passport.authenticate('jwt', {session : false}), (req, res) => {

    const {errors, isValid} = validateEducationInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {

            if(!profile){
                errors.noprofile = 'There is no profile for user'
                return res.status(404).json(errors)
            }

            let newEdu = {
                school : req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            // add new experience to array
            profile.educations.unshift(newEdu)

            profile.save()
                .then(prof => res.json(prof))
                .catch(err => {
                    errors.noprofile = 'There is no profile for user'
                    return res.status(400).json(errors)
                })
        })
        .catch(err => {
            errors.noprofile = 'There is no profile for user'
            return res.status(400).json(errors)
        })
})

module.exports = router