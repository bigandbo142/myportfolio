const express = require('express')
const router = express.Router()

// @route   api/profile/test
// @desc    Test profile api 
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from profile api'
}))

module.exports = router