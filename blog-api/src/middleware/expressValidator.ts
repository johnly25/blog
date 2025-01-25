import { body, validationResult, matchedData } from 'express-validator'
import { PrismaSingleton } from '../services/prismaClientSingleton'
const prisma = new PrismaSingleton()

const checkPasswordConfirm = () =>
    body('passwordConfirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords confirmation does not match password')
        }
        return true
    })

const checkUsername = () =>
    body('username').custom(async value => {
        const user = await prisma.user.findUnique({
            where: {
                username: value,
            },
        })
        if (user) {
            throw new Error('Username exists already')
        }
        return true
    })

export const signupValidator = [
    body('firstname').not().isEmpty(),
    body('lastname').not().isEmpty(),
    body('username').not().isEmpty(),
    body('password').not().isEmpty(),
    body('passwordConfirm').not().isEmpty(),
    body('email').not().isEmpty(),
    body('author').not().isEmpty(),
    checkUsername(),
    checkPasswordConfirm(),
]

export const checkErrors = (req, res, next) => {
    const result = validationResult(req)
    if (result.isEmpty()) {
        return next()
        // const data = matchedData(req)
        // return res.send(`Hello, ${data}!`)
    }
    return res.send({ errors: result.array() })
}
