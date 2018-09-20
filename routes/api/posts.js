const express = require('express')
const router = express.Router()
const passport = require('passport')

// Post model
const Post = require('../../models/Post')

// Profile model
const Profile = require('../../models/Profile')

// Validator for Post input
const validatePostInput = require('../../validations/post')

// Validator for Comment input
const validateCommentInput = require('../../validations/comment')

// @route   api/posts/test
// @desc    Test posts api 
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from post api'
}))

// @route   api/posts
// @desc    post new content 
// type     POST
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

// @route   api/posts/all
// @desc    get all posts 
// @type    GET
// @access  Public
router.get('/all', (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({msg: 'Posts not found'}))
})

// @route   api/posts/:id
// @desc    get post by id
// @type    GET
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({msg: 'Post not found'}))
})

// @route   api/posts/:id
// @desc    delete post by id
// @type    DELETE
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

    let errors = {}

    Profile.findOne({user: req.user.id})
        .then(profile => {

            Post.findById(req.params.id)
                .then(post => {

                    if(post.user.toString() !== req.user.id){
                        errors.unauthorized = 'User not authorized'
                        return res.status(401).json(errors)
                    }

                    post.remove().then(() => res.json({success: true}))
                        .catch(err => res.status(400).json({success: false}))
                })
                .catch(err => {
                    errors.postnotfound = 'Post not found'
                    return res.status(404).json(errors)
                })
        })
        .catch(err => {
            errors.usernotfound = 'User not found'
            return res.status(404).json(errors)
        })
})

// @route   api/posts/like/:id
// @desc    like a post
// @type    POST
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {}

    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(item => typeof item.user !== 'undefined' && item.user.toString() === req.user.id).length > 0){
                        errors.alreadyliked = 'You already liked this post'
                        return res.status(400).json(errors)
                    }

                    post.likes.unshift({user : req.user.id})
                    post.save().then(post => res.json(post))
                })
                .catch(err => {
                    console.log(err)
                    errors.postnotfound = 'Post not found'
                    return res.status(404).json(err)
                })
        })
        .catch(err => {
            errors.unauthorized = 'User not authorized'
            return res.status(401).json(errors)
        })
})

// @route   api/posts/unlike/:id
// @desc    unlike a post
// @type    POST
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {}

    Profile.findOne({ user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(item => typeof item.user !== 'undefined' && item.user.toString() === req.user.id).length === 0){
                        errors.unliked = 'You have not yet liked this post'
                        return res.status(400).json(errors)
                    }

                    // get remove index
                    const removeIndex = post.likes.filter(item => typeof item.user !== 'undefined').map(item => item.user.id)
                        .indexOf(req.user.id)

                    post.likes.splice(removeIndex, 1)
                    post.save().then(post => res.json(post))
                })
                .catch(err => {
                    console.log(err)
                    errors.postnotfound = 'Post not found'
                    return res.status(404).json(err)
                })
        })
        .catch(err => {
            errors.unauthorized = 'User not authorized'
            return res.status(401).json(errors)
        })
})


// @route   api/posts/comment/:post_id
// @desc    comment in a post
// @type    POST
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    Post.findById(req.params.post_id)
        .then(post => {
            const newComment = {
                user: req.user.id,
                content : req.body.content,
                avatar : req.body.avatar,
                name : req.body.name
            }

            post.comments.unshift(newComment)

            post.save().then(post => res.json(post))
        })
        .catch(err => {
            errors.postnotfound = 'Post not found'
            return res.status(404).json(errors)
        })
})


// @route   api/posts/comment/:post_id/:comment_id
// @desc    delete comment in a post
// @type    DELETE
// @access  Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {}
    Post.findById(req.params.post_id)
        .then(post => {
            if(post.comments.filter(item => item.id.toString() === req.params.comment_id).length === 0){
                errors.commentnotfound = 'Comment not found'
                return res.status(404).json(errors)
            }

            // get remove index
            const removeIndex = post.comments.map(item => item.id)
                .indexOf(req.params.comment_id)
            
            post.comments.splice(removeIndex, 1)

            post.save().then(() => res.json({success: true}))

        })
        .catch(err => {
            errors.postnotfound = 'Post not found'
            return res.status(404).json(errors)
        })
})
module.exports = router