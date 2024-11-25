// controllers/bookExchangeController.js
const BookExchange = require('../models/bookExchangeModel');

// Crear un nuevo intercambio de libros
exports.createExchange = async (req, res) => {
  try {
    const exchangeData = {
      libroOfrecido: req.body.libroOfrecido,
      libroDeseado: req.body.libroDeseado,
      usuarioSolicitante: req.user.id,
      usuarioReceptor: req.body.usuarioReceptor
    };

    const exchange = await BookExchange.create(exchangeData);
    res.status(201).json(exchange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aceptar o rechazar el intercambio de libros
exports.updateExchangeStatus = async (req, res) => {
  try {
    const { id } = req.params;  // ID del intercambio
    const { estado } = req.body;  // Nuevo estado (aceptado o rechazado)

    // Buscar el intercambio por ID
    const exchange = await BookExchange.findById(id);

    if (!exchange) {
      return res.status(404).json({ message: 'Intercambio no encontrado' });
    }

    // Verificar que el usuario autenticado sea el receptor
    if (exchange.usuarioReceptor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este intercambio' });
    }

    // Validar que el estado sea "accepted" o "rejected"
    if (!['accepted', 'rejected'].includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido. Debe ser "accepted" o "rejected"' });
    }

    // Actualizar el estado del intercambio
    exchange.estado = estado;
    await exchange.save();

    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los intercambios
exports.getAllExchanges = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const exchanges = await BookExchange.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('libroOfrecido libroDeseado usuarioSolicitante usuarioReceptor');
    const total = await BookExchange.countDocuments();

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

// Obtener un intercambio específico por su ID
exports.getExchangeById = async (req, res) => {
    try {
        const exchangeId = req.params.id;

        // Buscar el intercambio en la base de datos
        const exchange = await BookExchange.findById(exchangeId)
            .populate('libroOfrecido libroDeseado usuarioSolicitante usuarioReceptor');

        if (!exchange) {
            return res.status(404).json({ message: 'Intercambio no encontrado' });
        }

        res.status(200).json(exchange);
    } catch (error) {
        console.error('Error al obtener el intercambio:', error);
        res.status(500).json({ message: 'Error del servidor al obtener el intercambio' });
    }
};