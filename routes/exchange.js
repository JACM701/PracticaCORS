// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/bookExchangeController');
const authenticateToken = require('../middlewares/authMiddleware');

// Define las rutas
router.post('/', authenticateToken, exchangeController.createExchange); 
router.patch('/:id', authenticateToken, exchangeController.updateExchangeStatus); 
router.get('/', authenticateToken, exchangeController.getAllExchanges);

module.exports = router;
