const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    descripcion: { type: String, required: true },
    fecha_publicacion: { type: String, required: true },
    genero: { type: String, required: true },
    imagen: { type: String }, // La ruta de la imagen es opcional
    edicion: { type: String }, // Nuevo campo: edición del libro
    ano_publicado: { type: Number }, // Nuevo campo: año publicado
    tipo_pasta: { type: String }, // Nuevo campo: tipo de pasta
    editorial: { type: String }, // Nuevo campo: editorial del libro
    incluye_accesorios: { type: Boolean, default: false } // Nuevo campo: si incluye accesorios
});

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
