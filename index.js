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

app.get('/api/notes',(req,res) => {
    console.log()
    res.json(persons)
})



app.listen(PORT,() => console.log(`App listening on port: ${PORT}`))
