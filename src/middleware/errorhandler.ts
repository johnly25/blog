const errorHandler = (err, req, res, next) => {
    // const statusCode = res.statusCode ? res.statusCode : 500;
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)

    res.json({
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

export { errorHandler }
