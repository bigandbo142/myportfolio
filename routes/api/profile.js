const express = require('express')
const router = express.Router()
const passport = require('passport')
const keys = require('../../configs/keys')

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

    const errors = {}

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

module.exports = router