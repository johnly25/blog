import { test, expect } from 'vitest'
import userRouter from './userRoutes'
import 'express-async-errors'
import request from 'supertest'
import express from 'express'
import { errorHandler } from '../middleware/errorhandler'

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use('/user', userRouter)

app.use(errorHandler)

console.log('hello')
test('test', () => {
    expect(1 + 2).toBe(3)
})

test('POST /user', () => {
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
            console.log(response.body)
            expect(response.body)
        })
})
