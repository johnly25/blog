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
