import { test, expect, afterAll, beforeEach, beforeAll, describe } from 'vitest'
import { clearDB } from 'src/db/repository'
import app from '../app-loader'
import request from 'supertest'
import { loginUser, logUserNotAuthor } from 'src/utils/testingUtils'
//supertest you can send the app
//superagent you need to setup servers
beforeAll(async () => {
    await clearDB()
})

afterAll(async () => {
    await clearDB()
})

describe('persistence agent', async () => {
    const agent1 = request.agent(app)

    test('GET /:postid', async () => {
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

        await agent1
            .post(`/comments/${postid}`)
            .send({
                body: 'first comment',
            })
            .set('Authorization', `Bearer ${token}`)
        await agent1
            .post(`/comments/${postid}`)
            .send({
                body: 'second comment',
            })
            .set('Authorization', `Bearer ${token}`)

        const response2 = await agent1
            .get(`/comments/${postid}`)
            .set('Authorization', `Bearer ${token}`)
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
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        }).set('Authorization', `Bearer ${token}`)
        const post = response1.body
        const postid = post.id
        const response2 = await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        }).set('Authorization', `Bearer ${token}`)
        expect(response2.body).toHaveProperty('body', 'first comment')
        expect(response2.body).toHaveProperty('createdAt')
        expect(response2.body).toHaveProperty('userid')
        expect(response2.body).toHaveProperty('postid')
    })

    test('PUT /:commentid', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        }).set('Authorization', `Bearer ${token}`)
        const post = response1.body
        const postid = post.id
        const response2 = await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        }).set('Authorization', `Bearer ${token}`)

        const comment = response2.body
        const commentid = comment.id
        console.log(comment)
        const response3 = await agent1.put(`/comments/${commentid}`).send({
            body: 'edited first comment',
        }).set('Authorization', `Bearer ${token}`)
        expect(response3.body).toHaveProperty('body', 'edited first comment')
    })

    test('DELETE /:commentid', async () => {
        const loginResponse = await loginUser(agent1)
        const token = loginResponse.body.token
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        }).set('Authorization', `Bearer ${token}`)
        const post = response1.body
        const postid = post.id
        const response2 = await agent1.post(`/comments/${postid}`).send({
            body: 'first comment',
        }).set('Authorization', `Bearer ${token}`)
        const commentid = response2.body.id
        const response3 = await agent1.delete(`/comments/${commentid}`).set('Authorization', `Bearer ${token}`)
        expect(response3.body).toHaveProperty('id', commentid)
    })
})
