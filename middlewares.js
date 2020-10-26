const errorHandler = (err, req, res) => {
    // console.log(err)

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400)
        // eslint-disable-next-line no-undef
        console.log(process.env.MODE)

        res.json({
            message: 'Something broke with the json parser!',
            // eslint-disable-next-line no-undef
            stack: process.env.MODE === 'development' ? err.stack : {}
        })
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'malformatted id',
            // eslint-disable-next-line no-undef
            stack: process.env.MODE === 'development' ? err.stack : {}
        })
    }


    if (err.name === 'ValidationError') {
        if (err.errors.name) {
            console.log('inside name')
            return res.status(403).json({
                message: `${err.errors.name.properties.message}`,
                // eslint-disable-next-line no-undef
                stack: process.env.MODE === 'development' ? err.stack : {}
            })
        }

        if (err.errors.phone) {
            console.log('inside phone')
            console.log(err.errors.phone.properties.message)

            return res.status(403).json({
                message: `${err.errors.phone.properties.message}`,
                // eslint-disable-next-line no-undef
                stack: process.env.MODE === 'development' ? err.stack : {}
            })

        }

    }


    res.status(err.status || 500)
    return res.json({
        message: 'Something broke!',
        // eslint-disable-next-line no-undef
        stack: process.env.MODE === 'development' ? err.stack : {}
    })
}

const notFoundHandler = (req, res) => {
    res.status(404).send({
        message: 'unknown endpoint',
        // eslint-disable-next-line no-undef
        stack: process.env.MODE === 'development' ? err.stack : {}
    })
}

module.exports = {
    errorHandler,
    notFoundHandler
}
