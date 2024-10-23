const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    descripcion: { type: String, required: true },
    fecha_publicacion: { type: String, required: true },
    genero: { type: String, required: true },
    imagen: { type: String } // La ruta de la imagen es opcional
});

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
