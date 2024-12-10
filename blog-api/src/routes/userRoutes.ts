import { Router } from 'express'

const router = Router()

//read
router.get('/', (req, res) => {
    return res.send('GET HTTP method on user resource')
})

//create
router.post('/', (req, res) => {
    return res.send('POST HTTP method on user resource')
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
