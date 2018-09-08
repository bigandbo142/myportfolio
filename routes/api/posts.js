const express = require('express')
const router = express.Router()

// @route   api/posts/test
// @desc    Test posts api 
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from post api'
}))

module.exports = router