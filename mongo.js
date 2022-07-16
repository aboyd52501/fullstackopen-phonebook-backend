require("dotenv").config()
const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const URI = process.env.MONGODB_URI_NOPASS.replace('<pass>', password);;

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
});

const Person = mongoose.model('Person', personSchema);

const mongooseOperation = callback => (
    mongoose
        .connect(URI)
        .then(() => {
            // console.log('Connected to MongoDB.');
            // console.log(`Running callback: ${callback.name || callback.toString()}`);
            return callback();
        })
        .then(result => {
            // console.log("Closing connection to MongoDB.");
            mongoose.connection.close();
            return result;
        })
        .catch(console.error)
);

const addPerson = (name, number) => {
    const person = new Person({
        name: name,
        number: number,
        date: new Date(),
    });

    return mongooseOperation(() => person.save());
};

const getPeople = params => mongooseOperation(() => Person.find(params || {}));

module.exports = { Person, addPerson, getPeople };

switch (process.argv.length) {
    case 5:
        addPerson(process.argv[3], process.argv[4])
            .then(person => console.log(`added ${person.name} ${person.number} to phonebook DB`));
        break;
    case 3:
        getPeople()
            .then(people => people.forEach(person => console.log(person.name, person.number)));
        break;
    default:
        console.error(`Invalid number of arguments: ${process.argv.length}`);
        process.exit(1);
}