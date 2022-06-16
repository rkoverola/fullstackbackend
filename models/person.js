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

const phoneNumberValidator = (number) => {
    // Validate to form [nothing][2-3 numbers][hyphen][more numbers][nothing] eg. 09-12323
    const phoneNumberRE = new RegExp('(?<!.)[0-9]{2,3}-[0-9]{1,}(?!.)')
    return phoneNumberRE.test(number)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: phoneNumberValidator,
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
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
