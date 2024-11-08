// repositories/bookExchangeRepository.js
const BookExchange = require('../models/bookExchangeModel');

// Crear un nuevo intercambio de libros
exports.createExchange = async (exchangeData) => {
    const exchange = new BookExchange(exchangeData);
    return await exchange.save();
};

// Actualizar el estado del intercambio
exports.updateExchangeStatus = async (id, estado) => {
    return await BookExchange.findByIdAndUpdate(id, { estado }, { new: true });
};

// Obtener intercambios por usuario
exports.findExchangesByUser = async (userId) => {
    return await BookExchange.find({ $or: [{ usuarioSolicitante: userId }, { usuarioReceptor: userId }] })
        .populate('libroOfrecido libroDeseado usuarioSolicitante usuarioReceptor');
};
