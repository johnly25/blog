/* eslint-disable prettier/prettier */
import express from 'express'
import 'express-async-errors'
import passport from 'passport'

const router = express.Router()

router.get('/', (req, res) => {
    if (req.user) {
       return res.send(req.user)
    }
    return res.send('GET HTTP method on user asdfjlsakjdflsaj')
})

router.get('/login', function (req, res) {
    res.send('user' + 'hello !')
})

router.get('/login/password', (req, res) => {
    res.send('logging in GET')
})

router.post(
    '/login/password',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/failure',
    }),
)

router.post('/logout', function (req, res, next) {
    req.logout(err => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

export default router
