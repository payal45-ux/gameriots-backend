const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      include: { user: true, game: true },
      orderBy: { score: 'desc' }
    })
    res.json(leaderboard)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getGameLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      where: { gameId: parseInt(req.params.gameId) },
      include: { user: true, game: true },
      orderBy: { score: 'desc' }
    })
    res.json(leaderboard)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateScore = async (req, res) => {
  try {
    const { userId, gameId, score } = req.body
    const entry = await prisma.leaderboard.upsert({
      where: { id: 0 },
      update: { score },
      create: { userId, gameId: parseInt(gameId), score }
    })
    res.json({ message: 'Score updated!', entry })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getLeaderboard, getGameLeaderboard, updateScore }