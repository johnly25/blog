/* eslint-disable prettier/prettier */
import express from 'express'
import session from './config/session'
import passport from './config/passport'
import indexRouter from './routes/index'
import userRouter from './routes/users'
import authRouter from './routes/auth'
import postRouter from './routes/posts'
import commentRouter from './routes/comments'
import { checkAuthor } from './middleware/authMiddleware'
import cors from 'cors'
import { errorHandler } from './middleware/errorhandler'

const router = {
    indexRouter,
    userRouter,
    authRouter,
    postRouter,
    commentRouter,
}
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(session)
app.use(passport.session())
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})
app.use('/users', router.userRouter)
app.use('/posts', checkAuthor, router.postRouter)
app.use('/comments', router.commentRouter)
app.use('/auth', router.authRouter)
app.use('/', indexRouter)

app.use(errorHandler)

export default app
