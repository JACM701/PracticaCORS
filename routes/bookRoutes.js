// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require('../middlewares/authMiddleware');

const verifyRole = require('../middlewares/roleMiddleware');

// Ruta para aprobar un libro (requiere rol approver)
router.put('/:id/approve', authenticateToken, verifyRole('approver'), bookController.approveBook);

// Ruta para rechazar un libro (requiere rol approver)
router.put('/:id/reject', authenticateToken, verifyRole('approver'), bookController.rejectBook);

// Rutas CRUD para libros (ya existentes)
router.get('/', bookController.getAllBooks);
router.get('/:id', authenticateToken, bookController.getBookById);
router.post('/', authenticateToken, upload.single('imagen'), bookController.addBook);
router.put('/:id', authenticateToken, upload.single('imagen'), bookController.updateBook);
router.delete('/:id', authenticateToken, bookController.deleteBook);

module.exports = router;