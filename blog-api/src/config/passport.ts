import { Strategy as LocalStrategy } from 'passport-local'
import { comparePassword } from '../services/bcryptService'
import passport from 'passport'
import * as repository from '../db/repository'

import passportJWT from 'passport-jwt'
// import { Strategy, ExtractJWT } from 'passport-jwt'
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await repository.getUserByUsername(username)
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

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwtSecret || 'TOP_SECRET',
        },
        async (jwtPayload, done) => {
            try {
                const user = await repository.getUser(jwtPayload.user.id)
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' })
                }
                if (user) {
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        },
    ),
)
//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
// return UserModel.findOneById(jwtPayload.id)
//     .then(user => {
//         return cb(null, user);
//     })
//     .catch(err => {
//         return cb(err);
//     })
//     }
// ))

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
