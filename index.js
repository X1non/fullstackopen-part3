const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./models/person')

// express.json() is important to convert JSON (request data)
// into JavaScript object which then attached into request.body
app.use(express.json())

app.use(cors())

app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (request) => { return request.method !== 'POST' }
}))

app.use(morgan('tiny', {
  skip: (request) => { return request.method === 'POST' }
}))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch((error) => {
    next(error)
  })
})

app.get('/info', (request, response) => {
  const now = Date.now()
  const today = new Date(now)

  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      <p>${today.toString()}<p>`
    )
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body

  Person.findByIdAndUpdate(request.params.id, { number }, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    }).catch((error) => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  }).catch((error) => {
    next(error)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  // Ini juga kayaknya errornya masih terlalu sparse/longgar
  // Kayak bisa aja ada error lain di luar id yang menyebabkan casting error (?)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)