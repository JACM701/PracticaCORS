// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/bookExchangeController');

// Rutas para intercambio de libros
router.post('/', exchangeController.createExchange);
router.patch('/:id', exchangeController.updateExchangeStatus);
router.get('/', exchangeController.getUserExchanges);

module.exports = router;
