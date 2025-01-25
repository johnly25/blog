export const checkAuthor = (req, res, next) => {
    if (req.user && req.user.author) {
        next()
    } else {
        res.status(403).json({ message: 'Need to be an author' })
    }
}
