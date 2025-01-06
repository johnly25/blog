import { Strategy as LocalStrategy } from 'passport-local'
import { comparePassword } from '../services/bcryptService'
import passport from 'passport'
import * as repository from '../db/repository'

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await repository.getUserByUsername(username)
            // console.log('user conifg', user)
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

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await await repository.getUser(id)
        done(null, user)
    } catch (err) {
        done(err)
    }
})

export default passport
