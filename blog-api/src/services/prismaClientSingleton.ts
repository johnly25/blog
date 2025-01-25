import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

export class PrismaSingleton {
    static instance
    comment: any
    post: any
    author: any
    user: any
    constructor() {
        if (!PrismaSingleton.instance) {
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
            PrismaSingleton.instance = prisma
        }
        return PrismaSingleton.instance
    }
}
