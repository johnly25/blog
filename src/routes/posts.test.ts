import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { clearDB } from 'src/db/repository'
import app from '../app-loader'
import request from 'supertest'
import { loginUser, logUserNotAuthor } from '../utils/testingUtils'
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
    
    test('user is logged in', async () => {
        await loginUser(agent1)
        const response = await agent1.get(`/`)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('author')
    })

    test('POST /posts', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response = await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('body')
        expect(response.body).toHaveProperty('published')
    })

    test('POST not authorized /posts', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response = await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)

        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('body')
        expect(response.body).toHaveProperty('published')
    })

    test('POST /posts', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)

        await agent1
            .post(`/posts`)
            .send({
                title: 'second',
                body: 'hello my second post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)

        const response = await agent1
            .get(`/posts`)
            .set('Authorization', `Bearer ${token}`)
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
        const loginResponse = await logUserNotAuthor(agent1)
        const token = loginResponse.body.token
        const response = await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', 'Need to be an author')
    })

    test('GET /post:/:postsid', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response1 = await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)

        const post = response1.body
        const response = await agent1
            .get(`/posts/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('body')
    })

    test(`GET /posts:/:postsid that's doesn't exist in DB`, async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response = await agent1
            .get(`/posts/-1`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.body).toMatchObject({})
    })

    test('PUT /posts/:postid', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token

        const response1 = await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)

        const post = response1.body
        const response2 = await agent1
            .put(`/posts/${post.id}`)
            .send({
                title: 'editing first',
                body: 'editing hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)

        expect(response2.body).toHaveProperty('title', 'editing first')
        expect(response2.body).toHaveProperty(
            'body',
            'editing hello my first post',
        )
        expect(response2.body).toHaveProperty('published', true)
    })
    test('DELETE /posts/:postid', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response1 = await agent1
            .post(`/posts`)
            .send({
                title: 'first',
                body: 'hello my first post',
                published: 'true',
            })
            .set('Authorization', `Bearer ${token}`)
        const post = response1.body
        const postid = post.id
        const response2 = await agent1
            .delete(`/posts/${postid}`)
            .set('Authorization', `Bearer ${token}`)
        expect(response2.body).toHaveProperty('title')
        expect(response2.body).toHaveProperty('body')
        expect(response2.body).toHaveProperty('published')
        expect(response2.body).toMatchObject(response1.body)
    })
})
