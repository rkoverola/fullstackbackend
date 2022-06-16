const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

// Sanity check
console.log('Connecting to MongoDB')
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error when connecting: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// When converting to JSON, add id property based on what DB says and delete version string
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Create a model based on the schema
const Person = mongoose.model('Person', personSchema)
module.exports = Person
