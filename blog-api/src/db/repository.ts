import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { connect } from 'http2'
import { post } from 'superagent'

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
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
    await prisma.author.deleteMany()
    await prisma.user.deleteMany()
}

export const getPosts = async authorid => {
    const posts = await prisma.post.findMany({
        where: { authorid },
    })
    return posts
}

export const getPost = async postid => {
    const post = await prisma.post.findFirst({
        where: {
            id: postid,
        },
    })
    return post
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
export const deletePost = async (authorid, postid) => {
    const post = await prisma.post.delete({
        where: {
            authorid: authorid,
            id: postid,
        },
    })
    return post
}

export const updatePost = async (authorid, postid, title, body, published) => {
    const post = await prisma.post.update({
        where: {
            authorid: authorid,
            id: postid,
        },
        data: {
            title,
            body,
            published,
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

export const createComment = async (userid, postid, commentBody) => {
    const comment = await prisma.comment.create({
        data: {
            body: commentBody,
            user: {
                connect: {
                    id: userid,
                },
            },
            post: {
                connect: {
                    id: postid,
                },
            },
        },
        include: {
            post: true,
            user: true,
        },
    })
    return comment
}

export const createComment2 = async (userid, postid, commentBody) => {
    const comment = await prisma.comment.create({
        data: {
            body: commentBody,
            userid: userid,
            postid: postid,
        },
        include: {
            post: true,
            user: true,
        },
    })
    return comment
}

export const getComments = async (postid: number) => {
    const comments = await prisma.comment.findMany({
        where: {
            postid: postid,
        },
    })
    return comments
}

export const updateComment = async (commentid, commentBody) => {
    const comment = await prisma.comment.update({
        where: {
            id: commentid,
        },
        data: {
            body: commentBody,
        },
    })
    return comment
}

export const deleteComment = async commentid => {
    const comment = await prisma.comment.delete({
        where: {
            id: commentid,
        },
    })
    return comment
}
