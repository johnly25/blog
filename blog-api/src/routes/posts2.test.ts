/* eslint-disable prettier/prettier */
import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { clearDB } from 'src/db/repository'
import app from '../app-loader'
import request from 'superagent'
import http from 'http'

beforeEach(async () => {
    await clearDB()
})

let base = 'http://localhost'
let server

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

    test('testing', async () => {
        await agent1.post(`${base}/users`).type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: 'false',
        })

        await agent1
            .post(`${base}/auth/login/password`)
            .send({ username: 'kazuha', password: '123' })
        const response = await agent1.get(`${base}/`)
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
