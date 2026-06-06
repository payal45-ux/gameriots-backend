const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    })
    const { password: _, ...userWithoutPassword } = user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'User created!', token, user: userWithoutPassword })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'User not found' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Wrong password' })
    const { password: _, ...userWithoutPassword } = user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'Login successful!', token, user: userWithoutPassword })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
const updateUser = async (req, res) => {
  try {
    const { username, avatar } = req.body
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { username, avatar }
    })
    const { password: _, ...userWithoutPassword } = user
    res.json({ message: 'Profile updated!', user: userWithoutPassword })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


module.exports = { registerUser, loginUser, getUser, updateUser }