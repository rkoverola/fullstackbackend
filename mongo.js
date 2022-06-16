const mongoose = require('mongoose')

let password, name, number

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const showInfo = () => {
  const url = `mongodb+srv://fullstack:${password}@cluster0.tbz9x.mongodb.net/phonebookDB?retryWrites=true&w=majority`
  console.log('Phonebook:')
  mongoose
    .connect(url)
    .then(() => {
      Person.find({}).then((persons) => {
        persons.forEach( (p) => {
          console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const addEntry = () => {
  const url = `mongodb+srv://fullstack:${password}@cluster0.tbz9x.mongodb.net/phonebookDB?retryWrites=true&w=majority`
  const newPerson = new Person({
    name: name,
    number: number,
  })
  mongoose
    .connect(url)
    .then(() => {
      newPerson.save().then( () => {
        mongoose.connection.close()
      })
      console.log(`Added name: ${name}, number: ${number} to phonebook`)
    })
    .catch((err) => {
      console.log(err)
    })
}

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
if (process.argv.length === 3) {
  password = process.argv[2]
  showInfo()
}
if (process.argv.length === 4) {
  console.log('Please provide name and number as argument: node mongo.js <password> name number')
  process.exit(1)
}
if (process.argv.length > 4) {
  password = process.argv[2]
  name = process.argv[3]
  number = process.argv[4]
  addEntry()
}


