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
    console.log('calling post function')
    const user = await userService.createUser(userInfo)
    return res.json(user)
})

//read
router.get('/:userId', (req, res) => {
    return res.send('GET HTTP method on user resource')
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
