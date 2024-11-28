// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Asumiendo que tienes un middleware para manejar la subida de archivos

router.get('/', bookController.getAllBooks);
router.get('/:id', authenticateToken, bookController.getBookById);
router.post('/', authenticateToken, upload.single('imagen'), bookController.addBook);
router.put('/:id', authenticateToken, upload.single('imagen'), bookController.updateBook);
router.delete('/:id', authenticateToken, bookController.deleteBook);

module.exports = router;
