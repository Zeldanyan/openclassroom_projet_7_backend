const express = require('express');

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
    console.log(req.body);
    res.status(201).json({ // 201 = create
        message: 'Signup create'
    });
});

app.post('/api/auth/login', (req, res, next) => { // login
    console.log(req.body);
    res.status(200).json({ // 200 = ok
        userId: '',
        token: '',
    });
});

// GET --- SEARCH LIBRAIRIE
app.get('/api/books', (req, res, next) => { // librairie
    res.status(200).json({
    });
});

app.get('/api/books/:id', (req, res, next) => { // unique book by id
    res.status(200).json({
    });
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