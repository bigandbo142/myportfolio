const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

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
    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({email: "This email is not available"})
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

module.exports = router