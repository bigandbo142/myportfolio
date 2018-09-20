const express = require('express')
const router = express.Router()
const passport = require('passport')
const Post = require('../../models/Post')

// Validator for Post input
const validatePostInput = require('../../validations/post')

// @route   api/posts/test
// @desc    Test posts api 
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from post api'
}))

// @route   api/post
// @desc    post new content 
// type     DELETE
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        user: req.user.id,
        name: req.body.name,
        content: req.body.content,
        avatar: req.body.avatar
    })

    newPost.save().then(post => {
        res.json(post)
    })
    .catch(err => {
        errors.post = 'Error when create new post'
        res.status(400).json(errors)
    })

})


module.exports = router