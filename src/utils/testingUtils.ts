export const loginUser = async agent1 => {
    await agent1.post(`/users`).type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: 'true',
    })

    return await agent1
        .post(`/auth/login/password`)
        .send({ username: 'kazuha', password: '123' })
}

export const logUserNotAuthor = async agent2 => {
    await agent2.post(`/users`).type('form').send({
        firstname: 'john',
        lastname: 'nguyen',
        username: 'kazuha2',
        email: 'jayennguyen@gmail.com',
        password: '123',
        author: 'false',
    })

    return await agent2
        .post(`/auth/login/password`)
        .send({ username: 'kazuha2', password: '123' })
}
