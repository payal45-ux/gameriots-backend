const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // max 100 requests per 10 min
  message: { error: 'Too many requests, please try again later!' }
})

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, // login/register pe sirf 5 attempts
  message: { error: 'Too many attempts, please try again later!' }
})

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/api', limiter)

// Routes
app.use('/api/users/register', authLimiter)
app.use('/api/users/login', authLimiter)
app.use('/api/users', require('./src/routes/user.routes'))
app.use('/api/games', require('./src/routes/game.routes'))
app.use('/api/leaderboard', require('./src/routes/leaderboard.routes'))
app.use('/api/chat', require('./src/routes/chat.routes'))

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🎮 GamerRiots API is running!' })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})