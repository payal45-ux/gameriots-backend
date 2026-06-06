const express = require('express')
const router = express.Router()
const { getAllGames, getGameById, addGame } = require('../controllers/game.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/', getAllGames)
router.get('/:id', getGameById)
router.post('/', protect, addGame)

module.exports = router