// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/bookExchangeController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rutas para intercambio de libros
router.post('/', authenticateToken, exchangeController.createExchange);
router.patch('/:id', authenticateToken, exchangeController.updateExchangeStatus);
router.get('/', authenticateToken, exchangeController.getUserExchanges);

module.exports = router;
