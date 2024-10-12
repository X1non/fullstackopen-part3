const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./models/person')
require('dotenv').config()

// express.json() is important to convert JSON (request data)
// into JavaScript object which then attached into request.body
app.use(express.json())

app.use(cors())

app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: (request, response) => { return request.method !== 'POST' }
}))

app.use(morgan('tiny', {
  skip: (request, response) => { return request.method === 'POST' }
}))

const getId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const personData = data.find(p => p.id === id)
  
  if (personData) {
    response.json(personData)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const now = Date.now()
  const today = new Date(now)

  response.send(
    `<p>Phonebook has info for ${data.length} people</p>
    <p>${today.toString()}<p>`
  )
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body) {
    return response.status(400).json({
      error: 'entry data missing'
    })
  } 

  if (!body.name) {
    return response.status(400).json({
      error: 'name mising'
    })
  } 
  
  if (!body.number) {
    return response.status(400).json({
      error: 'number mising'
    })
  }
  
  if (data.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    "id": getId(),
    "name": body.name,
    "number": body.number
  }

  data = data.concat(newPerson)
  response.json(data)

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  data = data.filter(p => p.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})