const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    descripcion: { type: String },
    fecha_publicacion: { type: String },
    genero: { type: String },
    imagen: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);
