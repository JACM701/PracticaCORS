// models/bookExchangeModel.js
const mongoose = require('mongoose');

const bookExchangeSchema = new mongoose.Schema({
  libroOfrecido: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', // Referencia al modelo de Book
    required: true 
  },
  libroDeseado: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', // Referencia al modelo de Book
    required: true 
  },
  usuarioSolicitante: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencia al modelo de User
    required: true 
  },
  usuarioReceptor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referencia al modelo de User
    required: true 
  },
  fechaIntercambio: { 
    type: Date, 
    default: Date.now 
  },
  estado: { 
    type: String, 
    enum: ['pending', 'completed', 'canceled'], 
    default: 'pending' 
  }
});

module.exports = mongoose.model('BookExchange', bookExchangeSchema);
