/* eslint-disable prettier/prettier */
import express from 'express'
import session from './config/session'
import passport from './config/passport'
import userRouter from './routes/userRoutes'
import authRouter from './routes/auth'
import { errorHandler } from './middleware/errorhandler'

const router = { userRouter, authRouter }
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session)
app.use(passport.session())
app.use((req, res, next) => {
    console.log('user req', req.user)
    res.locals.currentUser = req.user
    next()
})
app.use('/user', router.userRouter)
app.use('/', router.authRouter)
app.use(errorHandler)

export default app