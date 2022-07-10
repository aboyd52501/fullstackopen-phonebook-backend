const express = require('express');
const app = express();

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    },
]

app.use(express.json());

app.all(/.*/, (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if(req.body) console.log(req.body);
    next();
});

app.get('/', (req, res) => {
    res.send("I am root");
});

app.get('/info', (req, res) => {
    res.send(`
        Phonebook has info for ${persons.length} people
        <br>
        ${new Date()}
    `);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (!person)
        res.status(404).end();
    else
        res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (!person) {
        console.log(`Attempted deletion of nonexistent person with ID ${id}`);
        res.status(404).end();
    }
    else {
        console.log(`Deleting person with ID ${id}`);
        persons = persons.filter(p => p.id !== id);
        res.status(204).end();
    }
});

const getID = () => Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);

const isInvalidRequest = req => {
    if (!req.body.name)
        return "Missing name"
    else if (!req.body.number)
        return "Missing number"
    else if (persons.find(person => person.name === req.body.name))
        return "Name already exists"
    else
        return false;
}

app.post('/api/persons', (req, res) => {
    const id = getID();
    const newPerson = req.body;
    newPerson.id = id;

    const isInvalid = isInvalidRequest(req);

    if (!isInvalid) {
        persons.push(newPerson);
        res.json(newPerson);
    }
    else {
        res
            .status(400)
            .json({ error: isInvalid });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});