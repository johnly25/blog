import express from 'express'
import session from './config/session'
import passport from 'passport'
import localStrategy from './config/passport'
import { PrismaClient } from '@prisma/client'
import userRouter from './routes/userRoutes'
import { errorHandler } from './middleware/errorhandler'

const router = { userRouter }

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || '3000'

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session)
app.use(passport.session())
passport.use(localStrategy)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                fullname: true,
                username: true,
            },
        })
        done(null, user)
    } catch (err) {
        done(err)
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', router.userRouter)

app.use(errorHandler)

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
})
