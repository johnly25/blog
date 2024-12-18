import { test, expect, afterAll } from 'vitest'
import userRouter from './userRoutes'
import 'express-async-errors'
import request from 'supertest'
import express from 'express'
import { beforeEach } from 'vitest'
import { errorHandler } from '../middleware/errorhandler'
import { PrismaClient } from '@prisma/client'
import { describe } from 'node:test'

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use('/user', userRouter)
app.use(errorHandler)

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DEV_DATABASE_URL,
        },
    },
})

const clearDB = async () => {
    await prisma.author.deleteMany()
    await prisma.user.deleteMany()
    await prisma.post.deleteMany()
    await prisma.comment.deleteMany()
}

beforeEach(async () => {
    await clearDB()
})

afterAll(async () => {
    await clearDB()
})

test('POST a /user', async () => {
    const response = await request(app).post('/user').type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: false,
    })
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('username')
    expect(response.body).toHaveProperty('fullname')
    expect(response.body).not.toHaveProperty('Author')
})

test('POST /user with author ', async () => {
    const response = await request(app).post('/user').type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: true,
    })
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('username')
    expect(response.body).toHaveProperty('fullname')
    expect(response.body).toHaveProperty('Author')
})

test('POST duplicate username /user', async () => {
    await request(app)
        .post('/user')
        .type('form')
        .send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: false,
        })
        .expect(200)

    return request(app)
        .post('/user')
        .type('form')
        .send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: false,
        })
        .expect(200)
        .then(response => {
            expect(response.body).toHaveProperty('error')
        })
})

test(`GET /user that is an author /user/:userid`, async () => {
    const response = await request(app).post('/user').type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: true,
    })
    const user = response.body
    const response2 = await request(app).get('/user/' + user.id)
    expect(response.status).toEqual(200)
    expect(response2.body).toHaveProperty('id')
    expect(response2.body).toHaveProperty('username')
    expect(response2.body).toHaveProperty('fullname')
    expect(response2.body).toHaveProperty('Author')
})

test(`GET /user that's not a author /user/:userid`, async () => {
    const response = await request(app).post('/user').type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: false,
    })
    const user = response.body
    const response2 = await request(app).get('/user/' + user.id)
    console.log(response2.body)
    expect(response.status).toEqual(200)
    expect(response2.body).toHaveProperty('id')
    expect(response2.body).toHaveProperty('username')
    expect(response2.body).toHaveProperty('fullname')
    expect(response2.body).toHaveProperty('Author', null)
})


test.skip('update user /user/:userid', async () => {})
test.skip('delete user /user/:userid', async () => {})
