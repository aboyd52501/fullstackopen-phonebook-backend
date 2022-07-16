const express = require('express');
const app = express();

const Person = require('./mongo').Person;

const morgan = require('morgan');

const cors = require('cors');

// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas", 
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace", 
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov", 
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck", 
//         "number": "39-23-6423122"
//     },
// ]

app.use(cors());

app.use(express.static('build'));

app.use(express.json());

const bodyToken = morgan.token('body', (req, res) => {
    if (Object.keys(req.body).length !== 0)
        return JSON.stringify(req.body);
    else
        return '';
});

const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body');
app.use(logger);

app.get('/', (req, res) => {
    res.send("I am root");
});

// app.get('/info', (req, res) => {
//     res.send(`
//         Phonebook has info for ${persons.length} people
//         <br>
//         ${new Date()}
//     `);
// });

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people);
        });
});

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            // console.log(person);
            if (person) {
                res.json(person);
            }
            else {
                res.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ error: 'Malformed id' });
        });
});

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const person = persons.find(person => person.id === id);
//     if (!person) {
//         // console.log(`Attempted deletion of nonexistent person with ID ${id}`);
//         res.status(404).end();
//     }
//     else {
//         // console.log(`Deleting person with ID ${id}`);
//         persons = persons.filter(p => p.id !== id);
//         res.status(204).end();
//     }
// });


// const isInvalidRequest = req => {
//     if (!req.body.name)
//         return "Missing name"
//     else if (!req.body.number)
//         return "Missing number"
//     else if (persons.find(person => person.name === req.body.name))
//         return "Name already exists"
//     else
//         return false;
// }

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        res.status(400).json({ error: 'Name or number missing' });
    }
    else {

        const newPerson = new Person({
            name, number
        });

        newPerson
            .save()
            .then(person => {
                res.json(person);
            })
            .catch(error => {
                res.status(400).send(error);
            });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});