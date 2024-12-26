import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const databaseUrl =
    process.env.NODE_ENV === 'test'
        ? process.env.DEV_DATABASE_URL
        : process.env.DATABASE_URL

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
})

export const clearDB = async () => {
    await prisma.post.deleteMany()
    await prisma.author.deleteMany()
    await prisma.user.deleteMany()
    await prisma.comment.deleteMany()
}

export const getPosts = async (authorid) => {
    const posts = await prisma.post.findMany({
        where: { authorid }
    })
    return posts
}
export const createPost = async (authorid, title, body, published) => {
    const post = await prisma.post.create({
        data: {
            title: title,
            body: body,
            published: published,
            authorid: authorid,
        },
    })
    return post
}

export const createUser = async (fullname, email, username, password) => {
    const user = await prisma.user.create({
        data: {
            fullname: fullname,
            email: email,
            username: username,
            password: password,
        },
    })
    return user
}

export const getUser = async (userid: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userid,
        },
        include: {
            author: true,
        },
    })
    return user
}

export const getUserByUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
        include: {
            author: true,
        },
    })
    return user
}

export const addAuthor = async (userid: number) => {
    const user = await prisma.user.update({
        where: {
            id: userid,
        },
        data: {
            author: {
                create: {},
            },
        },
        include: {
            author: true,
        },
    })
    return user
}
