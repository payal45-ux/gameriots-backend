const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')

// Google OAuth start
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failed' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'Google login successful!', token, user: req.user })
  }
)

// Failed
router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'Google login failed!' })
})

module.exports = router