const express = require('express')
const app = express()
let persons = require('./personsDb')
require('dotenv').config()

app.use(express.json())
const PORT = process.env.APP_PORT

console.log(PORT)

app.get('/',(req,res) => {
    return res.send('<h1>Root</h1>')
})

app.get('/api/persons',(req,res) => {
    console.log()
    res.json(persons)
})

app.get('/api/info',(req,res) => {
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




app.listen(PORT,() => console.log(`App listening on port: ${PORT}`))
