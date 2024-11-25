// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/bookExchangeController');

// Rutas para intercambio de libros
router.post('/', exchangeController.createExchange); // Crear un nuevo intercambio
router.patch('/:id', exchangeController.updateExchangeStatus); // Actualizar el estado del intercambio
router.get('/', exchangeController.getAllExchanges); // Obtener todos los intercambios de libros (sin protección de token)

module.exports = router;
