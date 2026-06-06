const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const { registerUser, loginUser, getUser, updateUser } = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')

const registerRules = [
  body('username').notEmpty().withMessage('Username required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters')
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
]

router.post('/register', registerRules, validate, registerUser)
router.post('/login', loginRules, validate, loginUser)
router.get('/:id', protect, getUser)
router.put('/update', protect, updateUser)

module.exports = router