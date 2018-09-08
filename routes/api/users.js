const express = require('express')
const router = express.Router()

// @route   api/users/test
// @desc    Test users api 
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Response from user api'
}))

module.exports = router