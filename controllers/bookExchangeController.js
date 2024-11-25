// controllers/bookExchangeController.js
const bookExchangeService = require('../services/bookExchangeService');
const BookExchange = require('../models/bookExchangeModel'); // Asegúrate de que la ruta sea correcta

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

// Obtener todos los intercambios de libros
exports.getAllExchanges = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página por defecto es la 1
        const limit = parseInt(req.query.limit) || 10; // Límite por defecto es 10 resultados por página
        const skip = (page - 1) * limit;

        // Consultar los intercambios con paginación
        const exchanges = await BookExchange.find()
            .populate('libroOfrecido')
            .populate('libroDeseado')
            .populate('usuarioSolicitante')
            .populate('usuarioReceptor')
            .skip(skip)
            .limit(limit)
            .exec();

        // Obtener el total de intercambios para calcular el número total de páginas
        const totalExchanges = await BookExchange.countDocuments();

        if (exchanges.length === 0) {
            return res.status(404).json({ message: 'No se encontraron intercambios de libros.' });
        }

        // Responder con los intercambios y la información de paginación
        res.json({
            data: exchanges,
            totalExchanges: totalExchanges,
            totalPages: Math.ceil(totalExchanges / limit),
            currentPage: page,
            perPage: limit
        });

    } catch (error) {
        console.error('Error al obtener los intercambios:', error);
        res.status(500).json({ message: 'Error al obtener los intercambios de libros.' });
    }
};
