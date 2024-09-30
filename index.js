const data = [
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

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/person/:id', (request, response) => {
  const id = request.params.id
  const personData = data.find(p => p.id === id)
  response.json(personData)
})

app.get('/info', (request, response) => {
  const now = Date.now()
  const today = new Date(now)

  response.send(
    `<p>Phonebook has info for ${data.length} people</p>
    <p>${today.toString()}<p>`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})