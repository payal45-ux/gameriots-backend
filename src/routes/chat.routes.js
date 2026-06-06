const express = require('express')
const router = express.Router()
const { sendMessage, getChatHistory } = require('../controllers/chat.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/message', protect, sendMessage)
router.get('/history', protect, getChatHistory)

module.exports = router