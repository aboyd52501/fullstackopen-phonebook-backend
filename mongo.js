require("dotenv").config()
const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
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