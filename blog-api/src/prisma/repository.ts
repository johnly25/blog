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
console.log(databaseUrl)

export const createUser = async (fullname, email, username, password) => {
    console.log(databaseUrl)
    const user = await prisma.user.create({
        data: {
            fullname: fullname,
            email: email,
            username: username,
            password: password,
        },
    })
    console.log('asdifljalskjflkajsld')
    console.log(user)
    return user
}
