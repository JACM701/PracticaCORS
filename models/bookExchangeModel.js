const mongoose = require('mongoose');

const bookExchangeSchema = new mongoose.Schema({
  libroOfrecido: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  libroDeseado: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  usuarioSolicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usuarioReceptor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estado: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  exchangeDate: Date
});

module.exports = mongoose.model('BookExchange', bookExchangeSchema);
