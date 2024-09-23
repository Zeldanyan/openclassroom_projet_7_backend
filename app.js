const express = require('express'); //express
const mongoose = require('mongoose'); //mongodb

const User = require('./models/User');
const Book = require('./models/Book');

mongoose.connect('mongodb+srv://Nyan:meow@cluster0.0ky8h.mongodb.net/P7?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// POST --- SIGNUP / LOGIN
app.post('/api/auth/signup', (req, res, next) => { // signup
    User.findOne({ email: req.body.email })
        .then((vr) => {
            if (vr) {
                res.status(400).json({ message: 'Cette email existe déjà' });
            } else {
                const user = new User({
                    ...req.body
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Signup create' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
});

app.post('/api/auth/login', (req, res, next) => { // login
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(400).json({ error });
            }

            if (user.password === password) {
                res.status(200).json({
                    userId: user._id,
                });
            } else {
                res.status(400).json({ error });
            }
        })
        .catch(error => res.status(400).json({ error }));
});

// GET --- SEARCH LIBRAIRIE
app.get('/api/books', (req, res, next) => { // librairie
    Book.find()
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => { // unique book by id
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
});

app.get('/api/books/bestrating', (req, res, next) => { // top 3
    res.status(200).json({
    });
});

// POST --- BOOK
app.post('/api/books', (req, res, next) => {
    res.status(200).json({
    });
});

// PUT --- BOOK ID
app.put('/api/books/:id', (req, res, next) => {
    res.status(200).json({
    });
});

// DELETE --- BOOK ID
app.delete('/api/books/:id', (req, res, next) => {
    res.status(200).json({
    });
});

// POST --- RATING
app.post('/api/books/:id/rating', (req, res, next) => {
    res.status(200).json({
    });
});

// test random
app.get('/api/meow', (req, res, next) => {
    const meow = [
        {
            animal: 'cat',
            id: 'kat',
            cute: 100,
            message: 'All Cats Are Cute',
        }
    ]
    res.status(200).json(meow);
});

module.exports = app;