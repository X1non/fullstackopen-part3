let data = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const express = require('express')
const app = express()

// Important to convert JSON into JavaScript object 
// to then, be attached into request.body
app.use(express.json())

const getId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/person/:id', (request, response) => {
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

app.delete('/api/person/:id', (request, response) => {
  const id = request.params.id
  data = data.filter(p => p.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})