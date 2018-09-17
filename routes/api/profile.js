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
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from profile api'
}))

// @route   api/profile
// @desc    request profile of current user 
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

module.exports = router