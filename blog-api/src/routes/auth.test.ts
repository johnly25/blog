// /* eslint-disable prettier/prettier */
// import { test, expect, afterAll } from 'vitest'
// import auth from './auth'
// import session from '../config/session'
// import passport from 'passport'
// import { Strategy as LocalStrategy} from 'passport-local'
// import 'express-async-errors'
// import request from 'supertest'
// import express from 'express'
// import { beforeEach } from 'vitest'
// import { errorHandler } from '../middleware/errorhandler'
// import { PrismaClient } from '@prisma/client'

// const app = express()
// app.use(express.urlencoded({ extended: false }))
// app.use(session)
// app.use(passport.session())

// app.use('/', auth)
// app.use(errorHandler)
// const prisma = new PrismaClient({
//     datasources: {
//         db: {
//             url: process.env.DEV_DATABASE_URL,
//         },
//     },
// })

// const clearDB = async () => {
//     await prisma.author.deleteMany()
//     await prisma.user.deleteMany()
//     await prisma.post.deleteMany()
//     await prisma.comment.deleteMany()
// }

// beforeEach(async () => {
//     await clearDB()
// })

// afterAll(async () => {
//     await clearDB()
// })

// test('POST a /user', async () => {
//     const response = await request(app).get('/login')
//     console.log(response.text)
// })

// test('POST a /login/password', async () => {
//     const response = await request(app).post('/login/password').send({
//         username: 'kazuha',
//         password: '123',
//     })
//     console.log('aldjflaskjf')
//     console.log(response.text)
// })
