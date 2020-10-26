const errorHandler = (err, req, res, next) => {
  // console.log(err)

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400)
    console.log(process.env.MODE)

    res.json({
      message: 'Something broke with the json parser!',
      stack: process.env.MODE === 'development' ? err.stack : {}
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).send({
      message: 'malformatted id',
      stack: process.env.MODE === 'development' ? err.stack : {}
    })
  }

  
  if (err.name === 'ValidationError') {
    if (err.errors.name) {
      console.log('inside name')
      return res.status(409).send({
        message: `${err.errors.name.properties.message}`,
        stack: process.env.MODE === 'development' ? err.stack : {}
      })
    }

    if (err.errors.phone) {
      console.log('inside phone')
      return res.status(409).send({
        message: `${err.errors.phone.properties.message}`,
        stack: process.env.MODE === 'development' ? err.stack : {}
      })
      
    }

  }


  res.status(err.status || 500)
  return res.json({
    message: 'Something broke!',
    stack: process.env.MODE === 'development' ? err.stack : {}
  })
}

const notFoundHandler = (req, res) => {
  res.status(404).send({
    message: 'unknown endpoint',
    stack: process.env.MODE === 'development' ? err.stack : {}
  })
}

module.exports = {
  errorHandler,
  notFoundHandler
}
