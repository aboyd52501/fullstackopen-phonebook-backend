const express = require('express');
const app = express();

const Person = require('./mongo').Person;

const morgan = require('morgan');

const cors = require('cors');

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

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`
                Phonebook has info for ${persons.length} people
                <br>
                ${new Date()}
            `);
        });
});

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people);
        });
});

app.get('/api/persons/:id', (req, res, next) => {
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
        .catch(next);
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            if (result)
                return res.status(204).end()
            else
                return res.status(404).json({ error: 'Person not found' });
        })
        .catch(next)
});


app.post('/api/persons', (req, res) => {
    let { name, number } = req.body;

    // Verify that the request is valid
    name = name.match(/^[a-zA-Z '-]{1,64}$/) ? name : '';
    number = number.match(/^[\d-]{1,32}$/) ? number : '';

    if (!name || !number) {
        if (!name) res.status(400).json({ error: "Invalid name" });
        else res.status(400).json({ error: "Invalid number" });
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

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'CastError')
        return res.status(400).send({ error: 'Malformed ID' });
    else if (error.name === '')

    next(error);
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});