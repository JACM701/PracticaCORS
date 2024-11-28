// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Asumiendo que tienes un middleware para manejar la subida de archivos

// GET all books (no authentication needed)
router.get('/', bookController.getAllBooks); 

// GET book by ID (authentication required)
router.get('/:id', authenticateToken, bookController.getBookById);

// POST new book (authentication required)
router.post('/', authenticateToken, upload.single('imagen'), bookController.addBook);

// PUT update book (authentication required)
router.put('/:id', authenticateToken, upload.single('imagen'), bookController.updateBook);

// DELETE book (authentication required)
router.delete('/:id', authenticateToken, bookController.deleteBook);

module.exports = router;

