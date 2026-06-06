const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check karo user pehle se hai ya nahi
    let user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value }
    })

    // Agar nahi hai toh naya banao
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: profile.displayName.replace(/\s/g, '_'),
          email: profile.emails[0].value,
          password: 'google_oauth',
          avatar: profile.photos[0].value
        }
      })
    }

    return done(null, user)
  } catch (error) {
    return done(error, null)
  }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } })
  done(null, user)
})

module.exports = passport