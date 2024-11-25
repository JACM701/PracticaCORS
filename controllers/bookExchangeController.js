// controllers/bookExchangeController.js
const bookExchangeService = require('../services/bookExchangeService');

// Crear un nuevo intercambio de libros
exports.createExchange = async (req, res) => {
    try {
        console.log('Iniciando creación de intercambio');
        const exchangeData = { ...req.body, usuarioSolicitante: req.user.id };
        console.log('Datos recibidos para el intercambio:', exchangeData);

        const newExchange = await bookExchangeService.createExchange(exchangeData);
        console.log('Intercambio creado exitosamente:', newExchange);

        res.status(201).json(newExchange);
    } catch (error) {
        console.error('Error al crear intercambio:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar el estado del intercambio
exports.updateExchangeStatus = async (req, res) => {
    try {
        console.log('Iniciando actualización de estado de intercambio');
        console.log('ID del intercambio a actualizar:', req.params.id);
        console.log('Nuevo estado:', req.body.estado);

        const updatedExchange = await bookExchangeService.updateExchangeStatus(req.params.id, req.body.estado);
        console.log('Estado del intercambio actualizado exitosamente:', updatedExchange);

        res.json(updatedExchange);
    } catch (error) {
        console.error('Error al actualizar estado de intercambio:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllExchanges = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Valores por defecto si no se proporcionan

    try {
        const exchanges = await bookExchangeService.findAllExchanges(page, limit);
        const total = await bookExchangeService.countAllExchanges(); // Total de intercambios

        res.status(200).json({
            data: exchanges,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalExchanges: total,
        });
    } catch (error) {
        console.error('Error al obtener todos los intercambios:', error.message);
        res.status(500).json({ message: 'Error al obtener los intercambios' });
    }
};


// Obtener intercambios del usuario con paginación
exports.getUserExchanges = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const exchanges = await bookExchangeService.findExchangesByUser(req.user.id, page, limit);
        const total = await bookExchangeService.countExchangesByUser(req.user.id);

        res.json({
            data: exchanges,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalExchanges: total,
        });
    } catch (error) {
        console.error('Error al obtener los intercambios del usuario:', error.message);
        res.status(500).json({ message: 'Error al obtener los intercambios del usuario' });
    }
};

