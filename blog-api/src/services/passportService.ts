// import passport from 'passport'
// import LocalStrategy from 'passport-local'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// export const passportAuth = passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
// })

// /* eslint-disable prettier/prettier */
// passport.use(new LocalStrategy(
//     (username, password, done) => {
//         try {
//             console.log('alkdjflajshello')
//             const user = prisma.user.findFirst(
//                 {
//                     where: {
//                         username: username
//                     }
//                 }
//             )
//             if (!user) {
//                 console.log('incorrect username')
//                 return done(null, false, { message: "incorrect username" })
//             }
//             if (!password) {
//                 console.log('incorrect password')
//                 return done(null, false, { message: "incorrect username" })
//             }
//             return done(null, user)
//         } catch (err) {
//             if (err) {
//                 return done(err)
//             }
//         }
//     }
// ))
