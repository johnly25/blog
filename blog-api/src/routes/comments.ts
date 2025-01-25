/* eslint-disable prettier/prettier */
import express from 'express'
import 'express-async-errors'
import CommentService from '../services/commentService'
import * as repository from '../db/repository'
const commentService = new CommentService(repository)
const router = express.Router()

router.get('/:postid', async (req: any, res) => {
    const postid = Number(req.params.postid)
    const comments = await commentService.getComments(postid)
    res.send(comments)
})

router.post('/:postid', async (req: any, res) => {
    const postid = Number(req.params.postid)
    const userid = Number(req.user.id)
    const commentBody = req.body.body
    const comment = await commentService.createComment(
        userid,
        postid,
        commentBody,
    )
    res.send(comment)
})

router.get('/:commentid', async (req, res) => {})

router.put('/:commentid', async (req, res) => {
    const commentid = Number(req.params.commentid)
    const commentBody = req.body.body
    const comment = await commentService.updateComment(commentid, commentBody)
    res.send(comment)
})

router.delete('/:commentid', async (req, res) => {
    const commentid = Number(req.params.commentid)
    const commentBody = req.body.body
    const comment = await commentService.deleteComment(commentid)
    res.send(comment)
})

export default router
