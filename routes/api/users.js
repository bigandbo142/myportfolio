const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../configs/keys')
const passport = require('passport')
const validateRegisterInput = require('../../validations/register')

// load User model
const User = require('../../models/User')

// @route   api/users/test
// @desc    Test users api 
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from user api'
}))

// @route   api/users/register
// @desc    register new users api 
// @access  Public
router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                errors.email = 'This email is not available'
                return res.status(400).json(errors)
            }

            const avatar = gravatar.url(req.body.email, {
                s   :   '200', // Size
                r   :   'pg', // rating
                d   :   'mm' // default
            })

            const newUser = new User({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                avatar
            })

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.log(err)
                bcrypt.hash(newUser.password, salt, (errHash, hash) => {
                    if(errHash) console.log(errHash)
                    newUser.password = hash
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(errSave => console.log(errSave))
                })
            })
        })
})

// @route   api/users/login
// @desc    login users api 
// @access  Public
router.post('/login', (req, res) => {
    const {email, password} = req.body;

    User.findOne({email: email})
        .then(user => {
            // check if user is existed
            if(!user) return res.status(404).json({error: 'User not found'})

            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {
                            email: user.email,
                            name: user.name,
                            avatar: user.avatar
                        }
                        // generate token
                        jwt.sign(payload, keys.tokenSecretKey, { expiresIn: 3600}, (err, token) => {
                            if(err) return res.status(500).json({error: 'Internal server error'})
                            return res.json({msg: 'Login successful', token})
                        })
                    }else{
                        return res.status(400).json({error: 'Password is incorrect'})
                    }
                })
        })
})

// @route   api/users/current
// @desc    load current user's information
// @access  Private
router.get('/current', passport.authenticate('jwt', {session: false}) ,(req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
        email: req.user.email
    })
})

module.exports = router