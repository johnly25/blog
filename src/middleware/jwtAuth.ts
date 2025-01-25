import passport from 'passport'

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false })
}(req, res, next)