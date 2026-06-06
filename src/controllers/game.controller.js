const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllGames = async (req, res) => {
  try {
    const { search } = req.query
    const games = await prisma.game.findMany({
      where: search ? {
        name: { contains: search, mode: 'insensitive' }
      } : {}
    })
    res.json(games)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getGameById = async (req, res) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!game) return res.status(404).json({ error: 'Game not found' })
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const addGame = async (req, res) => {
  try {
    const { name, imageUrl } = req.body
    if (!name) return res.status(400).json({ error: 'Game name required' })
    const game = await prisma.game.create({
      data: { name, imageUrl }
    })
    res.json({ message: 'Game added!', game })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getAllGames, getGameById, addGame }