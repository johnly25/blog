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

describe('persistence agent', async () => {
    const agent1 = request.agent(app)
    const agent2 = request.agent(app)
    
    test('user is logged in', async () => {
        await loginUser(agent1)
        const response = await agent1.get(`/`)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('author')
    })
    
    test.skip('GET /comments', async () => {
        await loginUser(agent1)
    })
    test.skip('POST /comments/:postid', async () => { 
        await loginUser(agent1)
        const response1 = await agent1.post(`/posts`).send({
            title: 'first',
            body: 'hello my first post',
            published: 'true',
        })
        const post = response1.body
        const response2 = await agent.get(`/${post.id}`).send({
            body: 'first comment',
        })
        expect(response2.body).toHaveProperty('body', 'first comment')
        expect(response2.body).toHaveProperty('createdAt')
        expect(response2.body).toHaveProperty('userid')
        expect(response2.body).toHaveProperty('postid')
    })
    test.skip('PUT /:commentid', async () => { })
    test.skip('DELETE /:commentid', async () => { })
})