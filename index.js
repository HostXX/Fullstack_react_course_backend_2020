const express = require('express')
const app = express()
let persons = require('./personsDb')
require('dotenv').config()


const generateId = () => {
    const id = Math.floor(Math.random() * 50000)
    return id
  }



app.use(express.json())
const PORT = process.env.APP_PORT

console.log(PORT)

app.get('/', (req, res) => {
  return res.send('<h1>Root</h1>')
})

app.get('/api/persons', (req, res) => {
  console.log()
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  console.log()
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

    // if (typeof body.content !== 'String' && body.content === '') {
    //   console.log('is not a string or is empty')
    //   return res.status(400).json({
    //     error: 'Content missing or bad content'
    //   })
    // }

    const newPerson = {
      name: body.name,
      phone: body.phone,
      id: generateId()
    }

    persons = persons.concat(newPerson)
    res.json(newPerson).end()
 
})

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`))
