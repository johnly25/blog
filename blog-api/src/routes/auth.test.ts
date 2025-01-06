/* eslint-disable prettier/prettier */
import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { PrismaClient } from '@prisma/client'
import app from '../app-loader'
import request from 'superagent'
import http from 'http'

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

let base = 'http://localhost'
let server

//dynamically create servers
//inconsistent for tests
beforeAll(() => {
    server = http.createServer(app)
    server = server.listen(0, () => {
        base += `:${server.address().port}`
    })
})

afterAll(() => {
    server.close()
})

beforeAll(async () => {
    await clearDB()
})

describe('persistent agent', () => {
    const agent1 = request.agent()
    const agent2 = request.agent()

    test('POST testing', async () => {
        const res = await agent1.post(`${base}/users`).type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: 'false',
        })
        const res2 = await agent1
            .post(`${base}/auth/login/password`)
            .send({ username: 'kazuha', password: '123' })
    })

    test('testing agent2', async () => {
        const res = await agent2.post(`${base}/users`).type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha2',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: 'false',
        })
        const res2 = await agent2
            .post(`${base}/auth/login/password`)
            .send({ username: 'kazuha2', password: '123' })
    })
})
