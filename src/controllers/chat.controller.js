const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const sendMessage = async (req, res) => {
  try {
    const { message, gameId } = req.body
    if (!message) return res.status(400).json({ error: 'Message required' })

    // AI reply — placeholder abhi ke liye
    const reply = `AI response for: ${message}`

    // Database mein save karo
    const chat = await prisma.chatHistory.create({
      data: {
        userId: req.user.id,
        message,
        reply,
        gameId: gameId ? parseInt(gameId) : null
      }
    })

    res.json({ message: 'Message received!', reply, chat })
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