const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');

// login/signup
router.post('/auth/signup', stuffCtrl.signup);
router.post('/auth/login', stuffCtrl.login);

// GET --- SEARCH LIBRAIRIE
router.get('/books', stuffCtrl.bookAll);
router.get('/books/:id', stuffCtrl.bookID);
router.get('/books/bestrating', stuffCtrl.bookRate);

// POST --- BOOK
router.post('/books', auth, multer, stuffCtrl.bookPost);

// PUT --- BOOK ID
router.put('/books/:id', auth, multer, stuffCtrl.bookPut);

// DELETE --- BOOK ID
router.delete('/books/:id', auth, stuffCtrl.bookDelete);

// POST --- RATING
router.post('/books/:id/rating', auth, stuffCtrl.bookRatePost);

module.exports = router;