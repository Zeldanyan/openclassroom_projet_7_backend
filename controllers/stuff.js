const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/User');
const Book = require('../models/Book');
const { log } = require('console');

exports.signup = async (req, res, next) => { // signup
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //regex for mail

    if (!regex.test(req.body.email)) { //regex test
        return res.status(400).json({ message: 'Email invalide' });
    }

    User.findOne({ email: req.body.email })
        .then((vr) => {
            if (vr) {
                res.status(400).json({ message: 'Cette email existe déjà' });
            } else {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                            .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = async (req, res, next) => { // login
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'error' });
            } else {
                bcrypt.compare(password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'error' });
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                'Meow',
                                { expiresIn: '24h' })
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}

exports.bookAll = async (req, res, next) => { // librairie
    Book.find()
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};

exports.bookID = async (req, res, next) => { // unique book by id
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.bookRate = async (req, res, next) => { // top 3
    res.status(200).json({
    });
};

exports.bookPost = async (req, res, next) => {
    const bookCreate = await JSON.parse(req.body.book);
    delete bookCreate._userId;

    const book = new Book({
        ...bookCreate,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.bookPut = async (req, res, next) => {
    const bookEdit = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookEdit._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                if (req.file) { //supprimer ancienne images
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => { });
                }
                Book.updateOne({ _id: req.params.id }, { ...bookEdit, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.bookDelete = async (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.bookRatePost = async (req, res, next) => { //rating book
    const { userId, rating } = req.body;
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
        res.status(404).json({ message: 'N existe pas' });
    }
    if (book.ratings.find(rate => rate.userId === userId)) { //only one rate par utilisateurs
        res.status(400).json({ message: 'Deja noté' });
    } else {
        book.ratings.push({
            userId: userId,
            grade: rating
        });
        book.save();
        res.status(201).json(book);
    }
};