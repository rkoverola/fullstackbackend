const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('custom', function (req, res) { return JSON.stringify(req.body) })

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor((Math.random() * 1000000))
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const infoString = `<div>Phonebook has info for ${persons.length} people.</div>`
    const dateString = `<div>${new Date()}</div>`
    response.send(infoString + dateString)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    if(!request.body.name || !request.body.number) {
        return response.status(400).json({
          error: 'Missing name or number'
        })
    }
    const duplicate = persons.find(p => p.name === request.body.name)
    if(duplicate) {
        return response.status(400).json({
            error: 'Name already exists'
        })
    }
    const newPerson = {
        id: generateId(),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Phonebook server running on port ${PORT}`)
})