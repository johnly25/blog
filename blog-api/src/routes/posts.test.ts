import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { clearDB } from 'src/db/repository'
import app from '../app-loader'
import request from 'supertest'

//supertest you can send the app
//superagent you need to setup servers
beforeEach(async () => {
    await clearDB()
})

afterAll(async () => {
    await clearDB()
})

describe('persistence agent', async () => {
    const agent1 = request.agent(app)
    const agent2 = request.agent(app)

    test('user is logged in', async () => {
        await loginUser(agent1)
        const response = await agent1.get(`/`)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('author')
    })

    test('POST /posts', async () => {
        await loginUser(agent1)
        const response = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('body')
        expect(response.body).toHaveProperty('published')
    })

    test('GET /posts', async () => {
        await loginUser(agent1)
        await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })

        await agent1.post(`/posts`).send({
            title: 'second',
            body: 'hello my second post',
            published: 'true',
        })

        const response = await agent1.get(`/posts`)
        const posts = response.body
        expect(response.body.length).toBe(2)
        expect(posts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'first',
                    body: 'hello my first post',

                }),
                expect.objectContaining({
                    title: 'second',
                    body: 'hello my second post',
                }),
            ]),
        )
    })

    test('check author authentication /posts', async () => {
        await logUserNotAuthor(agent1)
        const response = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', 'Need to be an author')
    })

    test('PUT /posts/:postid', async () => {
        await loginUser(agent1)
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        console.log(response1.body)
        const resposne = await agent.post(`/posts/`)

    })
    // test.skip('DELETE /posts/:postid', () => { })
})
const loginUser = async agent1 => {
    await agent1.post(`/users`).type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: 'true',
    })

    await agent1
        .post(`/login/password`)
        .send({ username: 'kazuha', password: '123' })
}

const logUserNotAuthor = async agent2 => {
    await agent2.post(`/users`).type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha2',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: 'false',
    })

    await agent2
        .post(`/login/password`)
        .send({ username: 'kazuha2', password: '123' })
}
