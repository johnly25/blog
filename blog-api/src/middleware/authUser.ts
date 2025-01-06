import jwt from 'jsonwebtoken'
import passport from 'passport'

export const authenticateUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(500).send({ message: info.message })
        }

        req.logIn(user, err => {
            if (err) {
                return next(err)
            }
            const body = { id: user.id }
            const token = jwt.sign(
                { user: body },
                process.env.jwtSecret || 'TOP_SECRET',
            )
            return res.json({ token })
        })
    })(req, res, next)
}
