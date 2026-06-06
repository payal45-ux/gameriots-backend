const { PrismaClient } = require('@prisma/client')
const Groq = require('groq-sdk')
const axios = require('axios')
const prisma = new PrismaClient()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const sendMessage = async (req, res) => {
  try {
    const { message, gameId } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })

    // Groq AI se reply lo
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional gaming assistant for GamerRiots. You help gamers with strategies, sensitivity settings, tips and tricks, game suggestions, and esports news. Answer in a helpful and detailed way.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.3-70b-versatile',
    })

    const reply = completion.choices[0]?.message?.content || 'No response'

    // YouTube videos fetch karo
    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${message} gaming`,
        type: 'video',
        maxResults: 3,
        order: 'relevance',
        key: process.env.YOUTUBE_API_KEY
      }
    })

    const videos = videoResponse.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))

    // Database mein save karo
    const chat = await prisma.chatHistory.create({
      data: {
        userId: req.user.id,
        message,
        reply,
        gameId: gameId ? parseInt(gameId) : null
      }
    })

    res.json({ message: 'Message received!', reply, videos, chat })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getChatHistory = async (req, res) => {
  try {
    const history = await prisma.chatHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ history })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { sendMessage, getChatHistory }