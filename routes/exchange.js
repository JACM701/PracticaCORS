// routes/exchange.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const exchangeController = require('../controllers/bookExchangeController');
const authenticateToken = require('../middlewares/authMiddleware');

// Ruta para obtener libros paginados
router.get('/books', authenticateToken, bookController.getPaginatedBooks);

// Rutas existentes
router.post('/', authenticateToken, exchangeController.createExchange);
router.patch('/:id', authenticateToken, exchangeController.updateExchangeStatus);
router.get('/', authenticateToken, exchangeController.getUserExchanges);

module.exports = router;
