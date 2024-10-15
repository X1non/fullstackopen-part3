const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('connecting into', url)

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Person name requried'],
    minLength: [3, 'must be at least 3 characters']
  },
  number: {
    type: String,
    validate: {
      validator: (v) => {
        console.log(v)
        return /^\d{2,3}-\d{6,}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number required'],
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = new mongoose.model('Person', personSchema)