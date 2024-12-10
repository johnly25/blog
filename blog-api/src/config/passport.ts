import LocalStrategy from 'passport-local'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const localStrategy = new LocalStrategy(async (username, password, done) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })
        if (!user) {
            return done(null, false, { message: 'Incorrect username' })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return done(null, false, { message: 'Incorrect password' })
        }
        return done(null, user)
    } catch (err) {
        return done(err)
    }
})

export default localStrategy
// export default passport => {
// passport.use(localStrategy)

// passport.serializeUser((user, done) => {
//     done(null, user.id)
// })

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: id,
//             },
//             select: {
//                 id: true,
//                 fullname: true,
//                 username: true,
//             },
//         })
//         done(null, user)
//     } catch (err) {
//         done(err)
//     }
// })
// }
