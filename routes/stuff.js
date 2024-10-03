const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const grimoire = require('../controllers/stuff');

// login/signup
router.post('/auth/signup', grimoire.signup);
router.post('/auth/login', grimoire.login);

// GET --- SEARCH LIBRAIRIE
router.get('/books', grimoire.bookAll);
router.get('/books/bestrating', grimoire.bookBestRate);
router.get('/books/:id', grimoire.bookID);



// POST --- BOOK
router.post('/books', auth, multer, grimoire.bookPost);

// PUT --- BOOK ID
router.put('/books/:id', auth, multer, grimoire.bookPut);

// DELETE --- BOOK ID
router.delete('/books/:id', auth, grimoire.bookDelete);

// POST --- RATING
router.post('/books/:id/rating', auth, grimoire.bookRatePost);

module.exports = router;