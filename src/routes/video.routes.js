const express = require('express')
const router = express.Router()
const { getVideos, getTrendingVideos } = require('../controllers/video.controller')

router.get('/', getVideos)
router.get('/trending', getTrendingVideos)

module.exports = router