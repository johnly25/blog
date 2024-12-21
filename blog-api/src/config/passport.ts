import { Strategy as LocalStrategy } from 'passport-local'
import { comparePassword } from '../services/bcryptService'

import { PrismaClient } from '@prisma/client'
import passport from 'passport'
const prisma = new PrismaClient()

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            })
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' })
            }
            const validPassword = await comparePassword(password, user.password)
            if (!validPassword) {
                return done(null, false, { message: 'Incorrect password.' })
            }
            return done(null, user)
        } catch (err) {
            done(err, null)
        }
    }),
)

passport.serializeUser((user: any, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id: any, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        done(null, user)
    } catch (err) {
        done(err)
    }
})

export default passport
