// controllers/bookExchangeController.js
const bookExchangeService = require('../services/bookExchangeService');
const BookExchange = require('../models/bookExchangeModel'); // Asegúrate de que la ruta sea correcta

// Crear un nuevo intercambio de libros
const createExchange = async (req, res) => {
    try {
        const usuarioSolicitante = req.user.id; // ID extraído del token
        const { libroOfrecido, libroDeseado, usuarioReceptor, estado, exchangeDate } = req.body;

        // Verificar que el usuario receptor existe
        const receptor = await User.findById(usuarioReceptor);
        if (!receptor) {
            return res.status(404).json({ message: 'Usuario receptor no encontrado' });
        }

        // Crear el intercambio
        const exchange = await Exchange.create({
            libroOfrecido,
            libroDeseado,
            usuarioSolicitante,
            usuarioReceptor,
            estado,
            exchangeDate
        });

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
