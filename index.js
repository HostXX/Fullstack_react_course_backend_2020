const express = require('express')
const app = express()
const morgan = require('morgan')
let persons = require('./personsDb')
require('dotenv').config()

const generateId = () => {
  const id = Math.floor(Math.random() * 50000)
  return id
}

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

const PORT = process.env.APP_PORT

console.log(PORT)

app.get('/', (req, res) => {
  return res.send('<h1>Root</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  res.send(
    `<h5> The phonebook has info for ${persons.length} people </h5>
        <h4>${new Date(Date.now())}</h4>
       `
  )
})

app.get('/api/person/:id', (req, res) => {
  const id = Number(req.params.id)
  let person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/person/:id', (req, res) => {
  const id = Number(req.params.id)

  const isDeleted = persons.find(person => person.id === id)

  if (isDeleted === undefined) {
    return res.status(204).end()
  }

  persons = persons.filter(person => person.id !== id)

  return res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const entryExist = persons.find(person => person.name === body.name)

  if (entryExist) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  if (body.name === '' || body.phone === '') {
    return res.status(400).json({
      error: "Phone or name can't be empty"
    })
  }

  const newPerson = {
    name: body.name,
    phone: body.phone,
    id: generateId()
  }

  persons = persons.concat(newPerson)
  res.json(newPerson).end()
})

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`))
