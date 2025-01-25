import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { clearDB } from 'src/db/repository'
import app from '../app-loader'
import request from 'supertest'

beforeEach(async () => {
    await clearDB()
})

afterAll(async () => {
    await clearDB()
})

describe('persistence agent', async () => {
    const agent1 = request.agent(app)

    test('POST a /users', async () => {
        const response = await agent1.post('/users').type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            passwordConfirm: '123',
            author: 'false',
        })
        console.log(response.body)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('username')
        expect(response.body).toHaveProperty('fullname')
        expect(response.body).not.toHaveProperty('author')
    })
    test('POST a /users with duplicate user', async () => {
        await agent1.post('/users').type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            passwordConfirm: '123',
            author: 'false',
        })
        
        const response = await agent1.post('/users').type('form').send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            passwordConfirm: '123',
            author: 'false',
        })
        console.log(response.body)
        expect(response.body).toHaveProperty('errors')
    })

    test('POST a /users without required field', async () => {
        const response = await agent1.post('/users').type('form').send({
            firstname: 'john',
            lastname: '',
            username: 'kazuha',
            email: 'jayennguyen@gmail.com',
            password: '123',
            author: 'false',
        })
        console.log(response.body)
        expect(response.body).toHaveProperty('errors')
    })
})
