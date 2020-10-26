const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const phoneEntrie = require('./database/models/phoneEntrie')

const {errorHandler, notFoundHandler} = require('./middlewares')

let persons = [
  {
    name: 'roberto arias',
    phone: '555445445',
    id: 0
  },
  {
    name: 'sitrus magnus',
    phone: '212312314141',
    id: 1
  },
  {
    name: 'viel',
    phone: '68746565',
    id: 2
  }
]

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
  })
)


app.get('/api/person', (req, res) => {
  phoneEntrie.find({}).then(entries => {
    res.json(entries)
  })
})

app.get('/api/info', (req, res) => {
phoneEntrie.find({}).then(entries => {
    res.send(
      `<h5> The phonebook has info for ${entries.length} people </h5>
          <h4>${new Date(Date.now())}</h4>
         `
    )
  })
  
})

app.get('/api/person/:id', (req, res) => {
  const id = req.params.id
  phoneEntrie.findById(id)
    .then(note => {
      if (note) {
        return res.json(note)
      } else {
        return res.status(404).end()
      }
    })
    .catch((err) => {
      console.log(err)
     next(err)
    })
})

app.delete('/api/person/:id', (req, res, next) => {
  const id = req.params.id
  phoneEntrie.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})
  

app.post('/api/person', (req, res,next) => {
  const body = req.body

  if (body.name === '' || body.phone === '') {
    return res.status(400).json({
      error: "Phone or name can't be empty"
    })
  }

  const newPhoneEntrie = new phoneEntrie({
    name: body.name,
    phone: body.phone
  })

  newPhoneEntrie
    .save()
    .then(entrie => {
      console.log('entrie saved!,', entrie)
      res.json(entrie).end()
    })
    .catch(err => {
      // console.log(err)
      next(err)
    })
})

app.put('/api/person/:id', (req, res,next) => {
  const id = req.params.id
  const body = req.body

  const newPhoneEntrie = {
    $set : {phone: body.phone}
  }
  phoneEntrie.findByIdAndUpdate(id, newPhoneEntrie, { new: true, runValidators: true  })
    .then(updatedPhoneEntrie => {
      res.json(updatedPhoneEntrie)
    })
    .catch(err => next(err))
})


app.use(notFoundHandler)
app.use(errorHandler)

// const host = '0.0.0.0'
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(port)
})
