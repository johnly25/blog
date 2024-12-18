import express from 'express'
import UserService from '../services/userService'
import * as repository from '../prisma/repository'
import 'express-async-errors'
const userService = new UserService(repository)

const router = express.Router()

//read
router.get('/', (req, res) => {
    return res.send('GET HTTP method on user resource')
})

//create
router.post('/', async (req, res) => {
    const userInfo = req.body
    const user = await userService.createUser(userInfo)
    const addAuthor = req.body.author === 'true'
    if (addAuthor) {
        const userid = user.id
        const user2 = await userService.addAuthor(userid)
        return res.json(user2)
    }
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
