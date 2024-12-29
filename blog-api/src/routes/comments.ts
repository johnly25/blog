/* eslint-disable prettier/prettier */
import express from 'express'
import 'express-async-errors'
import CommentService from '../services/commentService'
import * as repository from '../db/repository'
const commentService = new CommentService(repository)
const router = express.Router()


router.get('/', async (req: any, res) => {
})

router.post('/', async (req: any, res) => {
})

router.get('/:commentid', async (req, res) => {
})

router.put('/:commentid', async (req, res) => {

})

router.delete('/:commentid', async (req, res) => {
})

export default router
