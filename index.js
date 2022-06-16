require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('custom', function (req, ) { return JSON.stringify(req.body) })

const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))
app.use(cors())

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(result => {
    if(result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({}).then(result => {
    const infoString = `<div>Phonebook has info for ${result.length} people.</div>`
    const dateString = `<div>${new Date()}</div>`
    response.send(infoString + dateString)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  if(!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'Missing name or number'
    })
  }
  Person.findOne({ name: request.body.name })
    .then(result => {
      if(result) {
        response.status(400).json({
          error: 'Name already in phonebook'
        })
      } else {
        const newPerson = new Person({
          name: request.body.name,
          number: request.body.number
        })
        newPerson.save().then(result => {
          response.json(result)
        })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const updatedPerson = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Phonebook server running on port ${PORT}`)
})