const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack-exercise:${password}@cluster0.cf9bn.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = {
  'name': String,
  'number': String
}

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

