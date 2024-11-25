// routes/exchange.js
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/bookExchangeController');
const authenticateToken = require('../middlewares/authMiddleware');

// Ruta para crear un intercambio
router.post('/', authenticateToken, exchangeController.createExchange);

// Ruta para aceptar o rechazar un intercambio (solo el receptor)
router.patch('/:id', authenticateToken, exchangeController.updateExchangeStatus);

// Ruta para obtener todos los intercambios
router.get('/', authenticateToken, exchangeController.getAllExchanges);

// *** Nueva ruta para obtener un intercambio específico por su ID ***
router.get('/:id', authenticateToken, exchangeController.getExchangeById);

// Ruta para eliminar un intercambio
router.delete('/:id', authenticateToken, exchangeController.deleteExchange);

module.exports = router;