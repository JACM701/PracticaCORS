const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  descripcion: String,
  fecha_publicacion: Date,
  genero: String,
  imagen: String,
  edicion: String,
  ano_publicado: Number,
  tipo_pasta: String,
  editorial: String,
  incluye_accesorios: Boolean,
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Hace referencia al modelo de usuario
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
