const axios = require('axios')

const getVideos = async (req, res) => {
  try {
    const { game = 'gaming', max = 4 } = req.query
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${game} tips tricks gameplay`,
        type: 'video',
        maxResults: max,
        order: 'relevance',
        key: process.env.YOUTUBE_API_KEY
      }
    })
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))
    res.json({ videos })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getTrendingVideos = async (req, res) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: 'gaming trending 2026',
        type: 'video',
        maxResults: 4,
        order: 'viewCount',
        key: process.env.YOUTUBE_API_KEY
      }
    })
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))
    res.json({ videos })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getVideos, getTrendingVideos }