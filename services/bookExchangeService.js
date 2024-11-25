// services/bookExchangeService.js
const bookExchangeRepository = require('../repositories/bookExchangeRepository');
const bookRepository = require('../repositories/bookRepository');

exports.createExchange = async (exchangeData) => {
    try {
        const libroOfrecido = await bookRepository.getBookById(exchangeData.libroOfrecido);
        const libroDeseado = await bookRepository.getBookById(exchangeData.libroDeseado);

        if (!libroOfrecido || !libroDeseado) {
            throw new Error('Uno de los libros no existe');
        }

        if (libroOfrecido.owner.toString() !== exchangeData.usuarioSolicitante.toString() ||
            libroDeseado.owner.toString() !== exchangeData.usuarioReceptor.toString()) {
            throw new Error('Los libros no pertenecen a los usuarios correctos');
        }

        return await bookExchangeRepository.createExchange(exchangeData);
    } catch (error) {
        throw new Error('Error al crear el intercambio: ' + error.message);
    }
};

exports.updateExchangeStatus = async (id, estado) => {
    return await bookExchangeRepository.updateExchangeStatus(id, estado);
};

exports.findAllExchanges = async (page, limit) => {
    return bookExchangeRepository.findAllExchanges(page, limit);
};

exports.countAllExchanges = async () => {
    return bookExchangeRepository.countAllExchanges();
};

exports.findExchangesByUser = async (userId, page, limit) => {
    return bookExchangeRepository.findExchangesByUser(userId)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
};

exports.countExchangesByUser = async (userId) => {
    return bookExchangeRepository.countExchangesByUser(userId);
};
