/* eslint-disable prettier/prettier */
import express from 'express'
import 'express-async-errors'
import UserService from '../services/userService'
import * as repository from '../db/repository'
const userService = new UserService(repository)
const router = express.Router()


router.get('/', async (req: any, res) => {
    const authorid = Number(req.user.author.id)
    const posts = await userService.getPosts(authorid)
    res.send(posts)
})

router.post('/', async (req: any, res) => {
    const { title, body } = req.body
    const published = req.body.published === 'true'
    const authorid = Number(req.user.author.id)
    const post = await userService.createPost(authorid, title, body, published)
    res.send(post)
})

router.get('/:postid', async (req, res) => { })
router.put('/:postid', async (req, res) => { })
router.delete('/:postid', async (req, res) => { })

export default router
