// models/BookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha_publicacion: { type: Date, required: true },
  genero: { type: String, required: true },
  imagen: { type: String },
  edicion: { type: String },
  ano_publicado: { type: Number, required: true },
  tipo_pasta: { type: String, enum: ['Dura', 'Suave'], required: false },
  editorial: { type: String, required: true },
  incluye_accesorios: { type: Boolean, default: false },
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
