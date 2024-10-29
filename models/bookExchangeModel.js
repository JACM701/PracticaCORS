// models/bookExchangeModel.js
const mongoose = require('mongoose');

const bookExchangeSchema = new mongoose.Schema({
  libroOfrecido: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  libroDeseado: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  usuarioSolicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fechaIntercambio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookExchange', bookExchangeSchema);
