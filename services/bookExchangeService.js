// services/bookExchangeService.js
const bookExchangeRepository = require('../repositories/bookExchangeRepository');
const bookRepository = require('../repositories/bookRepository'); // Para verificar la disponibilidad de libros

// Crear intercambio de libros
exports.createExchange = async (exchangeData) => {
    // Verificar que ambos libros existen y pertenecen a los usuarios adecuados
    const libroOfrecido = await bookRepository.getBookById(exchangeData.libroOfrecido);
    const libroDeseado = await bookRepository.getBookById(exchangeData.libroDeseado);

    if (!libroOfrecido || !libroDeseado) throw new Error('Uno de los libros no existe');
    if (libroOfrecido.owner.toString() !== exchangeData.usuarioSolicitante.toString() ||
        libroDeseado.owner.toString() !== exchangeData.usuarioReceptor.toString()) {
        throw new Error('Los libros no pertenecen a los usuarios correspondientes');
    }

    // Crear el intercambio
    return await bookExchangeRepository.createExchange(exchangeData);
};

// Actualizar el estado del intercambio
exports.updateExchangeStatus = async (id, estado) => {
    return await bookExchangeRepository.updateExchangeStatus(id, estado);
};

// Obtener intercambios de un usuario
exports.findExchangesByUser = async (userId) => {
    return await bookExchangeRepository.findExchangesByUser(userId);
};