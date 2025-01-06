import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { clearDB } from 'src/db/repository'
import app from '../app-loader'
import request from 'supertest'

//supertest you can send the app
//superagent you need to setup servers
beforeAll(async () => {
    await clearDB()
})

afterAll(async () => {
    await clearDB()
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
        .post(`/auth/login/password`)
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
        .post(`/auth/login/password`)
        .send({ username: 'kazuha2', password: '123' })
}

describe('persistence agent', async () => {
    const agent1 = request.agent(app)

    test('user is logged in', async () => {
        await loginUser(agent1)
        const response = await agent1.get(`/`)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('author')
    })

    test('GET /:postid', async () => {
        await loginUser(agent1)
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        const post = response1.body
        const postid = post.id
        await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        })
        await agent1.post(`/comments/${postid}`).send({
            body: 'second comment',
        })
        const response2 = await agent1.get(`/comments/${postid}`)
        const comments = response2.body
        expect(comments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    body: 'first comment',
                }),
                expect.objectContaining({
                    body: 'second comment',
                }),
            ]),
        )
    })

    test('POST /:comments/:postid', async () => {
        await loginUser(agent1)
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        const post = response1.body
        const postid = post.id
        const response2 = await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        })
        expect(response2.body).toHaveProperty('body', 'first comment')
        expect(response2.body).toHaveProperty('createdAt')
        expect(response2.body).toHaveProperty('userid')
        expect(response2.body).toHaveProperty('postid')
    })

    test('PUT /:commentid', async () => {
        await loginUser(agent1)
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        const post = response1.body
        const postid = post.id
        const response2 = await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        })

        const comment = response2.body
        const commentid = comment.id
        console.log(comment)
        const response3 = await agent1.put(`/comments/${commentid}`).send({
            body: 'edited first comment',
        })
        console.log(response3.body)
        expect(response3.body).toHaveProperty('body', 'edited first comment')
    })

    test('DELETE /:commentid', async () => {
        await loginUser(agent1)
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        const post = response1.body
        const postid = post.id
        const response2 = await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        })
        const commentid = response2.body.id
        const response3 = await agent1.delete(`/comments/${commentid}`)
        expect(response3.body).toHaveProperty('id', commentid)
    })
})
