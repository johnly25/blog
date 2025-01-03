/* eslint-disable prettier/prettier */
import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import app from '../app-loader'
import request from 'supertest'
import { clearDB } from 'src/db/repository'

beforeAll(async () => {
    await clearDB()
})

describe('persistent agent', () => {
    // this way works but it doesn't show the console logs and response body
    // it's because the original request doesn't return a json
    // 3rd way to to create 3 development servers and tests the routes individualls but that takes way to long
    const server1 = request.agent(app)
    const server2 = request.agent(app)

    test('testing', async () => {
        const res = await server1.post(`/users`).type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: 'false',
        })
        const res2 = await server1
            .post(`/login/password`)
            .send({ username: 'kazuha', password: '123' })
    })

    test('testing agent2', async () => {
        const res = await server2.post(`/users`).type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha2',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: 'false',
        })
        const res2 = await server2
            .post(`/login/password`)
            .send({ username: 'kazuha2', password: '123' })
    })
})
