const express = require('express')
const router = express.Router()
const { getLeaderboard, getGameLeaderboard, updateScore } = require('../controllers/leaderboard.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', getLeaderboard)
router.get('/:gameId', getGameLeaderboard)
router.post('/', protect, updateScore)

module.exports = router