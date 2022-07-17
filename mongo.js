require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

const personNameRegex = /^[a-zA-Z '-]{1,64}$/;
const personNumberRegex = /^(\d{2,3}-)?\d{1,64}$/;

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    match: personNameRegex,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: num => personNumberRegex.test(num),
      message: props => `${props.value} is not a valid phone number`,
    },
  },
  date: {
    type: Date,
    required: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// // runs a callback, closes the connection, and returns the result of the callback.
// const mongooseOperation = callback => (
//     mongoose
//         .connect(URI)
//         .then(() => {
//             // console.log('Connected to MongoDB.');
//             // console.log(`Running callback: ${callback.name || callback.toString()}`);
//             return callback();
//         })
//         .then(result => {
//             // console.log("Closing connection to MongoDB.");
//             mongoose.connection.close();
//             return result;
//         })
//         .catch(console.error)
// );

// const addPerson = (name, number) => {
//     const person = new Person({
//         name: name,
//         number: number,
//         date: new Date(),
//     });

//     return mongooseOperation(() => person.save());
// };

// const getPeople = params => mongooseOperation(() => Person.find(params || {}));

module.exports = { Person };