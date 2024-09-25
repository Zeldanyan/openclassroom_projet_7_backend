const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Book = require('../models/Book');

router.post('/auth/signup', (req, res, next) => { // signup
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(req.body.email)) {
        return res.status(400).json({ message: 'Email invalide' });
    }

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

router.post('/auth/login', (req, res, next) => { // login
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
router.get('/books', (req, res, next) => { // librairie
    Book.find()
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
});

router.get('/books/:id', (req, res, next) => { // unique book by id
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
});

router.get('/books/bestrating', (req, res, next) => { // top 3
    res.status(200).json({
    });
});

// POST --- BOOK
router.post('/books', (req, res, next) => {
    res.status(200).json({
    });
});

// PUT --- BOOK ID
router.put('/books/:id', (req, res, next) => {
    res.status(200).json({
    });
});

// DELETE --- BOOK ID
router.delete('/books/:id', (req, res, next) => {
    res.status(200).json({
    });
});

// POST --- RATING
router.post('/books/:id/rating', (req, res, next) => {
    res.status(200).json({
    });
});

// test random
router.get('/meow', (req, res, next) => {
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

module.exports = router;