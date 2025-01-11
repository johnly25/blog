import express from 'express'
import 'express-async-errors'
const router = express.Router()

router.get('/', (req, res) => {
    return res.send(req.user)
    return res.send('hello')
})
export default router
