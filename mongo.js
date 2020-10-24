const mongoose = require('mongoose')

const PhoneEntrieSchema = new mongoose.Schema({
  name: String,
  phone: String
})

const PhoneEntrie = mongoose.model('PhoneEntrie', PhoneEntrieSchema)

function getAllEntries () {
  return PhoneEntrie.find({}).then(result => {
    return result
  })
}

const name = String(process.argv[3])
const phone = String(process.argv[4])
const password = process.argv[2]
const url = `mongodb+srv://developer:${password}@socialnetwork.scyeh.mongodb.net/thePhonebook?retryWrites=true&w=majority`

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

if (process.argv.length === 4) {
    console.log(
      'Please provide a number to be saved'
    )
    process.exit(1)
  }

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('OK'))
  .catch(err => console.log('Mongo auth, ',err.message))

if (process.argv.length === 3) {
  console.log("Nice! let's will print all entries")
  getAllEntries().then(entries => {
      console.log("")
      
      console.log("phonebook:")
      console.log("---------------------------")
    entries.forEach((entrie) => {
        const { name, phone } = entrie
        console.log(`${name.charAt(0).toUpperCase() + name.slice(1)}: ${phone}`)
    }
     )
    process.exit(1)
  })
}

const newPhoneEntrie = new PhoneEntrie({
  name: name,
  phone: phone
})

newPhoneEntrie.save().then(result => {
  console.log(result)
  console.log('Entrie saved!')
  mongoose.connection.close()
})
