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

exports.findExchangesByUser = (userId) => {
    // Devuelve una consulta de MongoDB que luego puede ser encadenada con .skip() y .limit()
    return BookExchange.find({ usuarioSolicitante: userId });
};
