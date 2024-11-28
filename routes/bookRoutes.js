// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require('../middlewares/authMiddleware');

const verifyRole = require('../middlewares/roleMiddleware');

// Ruta para aprobar un libro (requiere rol approver)
router.put('/books/:id/approve', authenticateToken, verifyRole('approver'), bookController.approveBook);

// Ruta para rechazar un libro (requiere rol approver)
router.put('/books/:id/reject', authenticateToken, verifyRole('approver'), bookController.rejectBook);

// Rutas CRUD para libros (ya existentes)
router.get('/books', bookController.getAllBooks);
router.get('/books/:id', authenticateToken, bookController.getBookById);
router.post('/books', authenticateToken, upload.single('imagen'), bookController.addBook);
router.put('/books/:id', authenticateToken, upload.single('imagen'), bookController.updateBook);
router.delete('/books/:id', authenticateToken, bookController.deleteBook);

module.exports = router;