import express from 'express'
import UserService from '../services/userService'
import * as repository from '../prisma/repository'
import * as bcrypt from '../services/bcryptService'
import 'express-async-errors'
const userService = new UserService(repository)

const router = express.Router()

router.post('/', async (req, res) => {
    const { firstname, lastname, username, password, email, author } = req.body
    const hashPassword = await bcrypt.hashPassword(password)
    const user = await userService.createUser(
        firstname,
        lastname,
        username,
        hashPassword,
        email,
        author,
    )
    return res.json(user)
})

//read
router.get('/:userId', async (req, res) => {
    const userid = Number(req.params.userId)
    const user = await userService.getUser(userid)
    return res.send(user)
})

//update
router.put('/:userId', (req, res) => {
    return res.send('PUT HTTP method on user resource')
})

//delete
router.delete('/:userId', (req, res) => {
    return res.send('DELETE HTTP method on user resource')
})

export default router
