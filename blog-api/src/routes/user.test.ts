import { test, expect, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from '../services/bcryptService'
import app from '../app-loader'

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
        author: 'false',
    })
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('username')
    expect(response.body).toHaveProperty('fullname')
    expect(response.body).not.toHaveProperty('author')
})

test('POST /user with author ', async () => {
    const response = await request(app).post('/user').type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha2',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: 'true',
    })
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('username')
    expect(response.body).toHaveProperty('fullname')
    expect(response.body).toHaveProperty('author')
})

test('POST duplicate username /user', async () => {
    await request(app)
        .post('/user')
        .type('form')
        .send({
            firstname: 'john',
            lastname: 'nguyen',
            username: 'kazuha3',
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
            username: 'kazuha3',
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
        username: 'kazuha5',
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
    expect(response2.body).toHaveProperty('author')
})

test(`GET /user that's not a author /user/:userid`, async () => {
    const response = await request(app).post('/user').type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha6',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: false,
    })
    const user = response.body
    const response2 = await request(app).get('/user/' + user.id)
    expect(response.status).toEqual(200)
    expect(response2.body).toHaveProperty('id')
    expect(response2.body).toHaveProperty('username')
    expect(response2.body).toHaveProperty('fullname')
    expect(response2.body).toHaveProperty('author', null)
})

test('POST /user should have hashed password', async () => {
    const form = {
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha7',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: false,
    }
    const response = await request(app).post('/user').type('form').send(form)
    const user = response.body
    expect(response.status).toEqual(200)
    expect(response.status).toEqual(200)
    expect(
        await bcrypt.comparePassword(form.password, user.password),
    ).toBeTruthy()
})

test.skip('update user /user/:userid', async () => {})
test.skip('delete user /user/:userid', async () => {})
