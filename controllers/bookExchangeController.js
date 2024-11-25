// controllers/bookExchangeController.js
const bookExchangeService = require('../services/bookExchangeService');
const BookExchange = require('../models/bookExchangeModel'); // Asegúrate de que la ruta sea correcta

// Crear un nuevo intercambio
exports.createExchange = async (req, res) => {
    try {
        const exchangeData = {
            libroOfrecido: req.body.libroOfrecido,
            libroDeseado: req.body.libroDeseado,
            usuarioSolicitante: req.user.id,
            usuarioReceptor: req.body.usuarioReceptor
        };

        const exchange = await bookExchangeService.createExchange(exchangeData);
        res.status(201).json(exchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateExchangeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const updatedExchange = await bookExchangeService.updateExchangeStatus(id, estado);
        if (!updatedExchange) {
            return res.status(404).json({ message: 'Intercambio no encontrado' });
        }

        res.json(updatedExchange);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllExchanges = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const exchanges = await bookExchangeService.findAllExchanges(page, limit);
        const total = await bookExchangeService.countAllExchanges();

        res.json({
            data: exchanges,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalExchanges: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
