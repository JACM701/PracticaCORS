const multer = require('multer');
const path = require('path');
const Book = require('../models/bookModel'); // Importar el modelo de Mongoose

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obtiene una lista de libros
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */

// Obtener todos los libros
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find(); // Usar Mongoose para obtener todos los libros
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los libros' });
    }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id); // Usar Mongoose para obtener el libro por ID
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el libro' });
    }
};

// Añadir libros ahora con imágenes
exports.addBook = async (req, res) => {
    try {
        const { titulo, autor, descripcion, fecha_publicacion, genero } = req.body;

        let imagen = '';
        if (req.file) {
            imagen = `/uploads/${req.file.filename}`; // Guardar la ruta de la imagen
        }

        const newBook = new Book({
            titulo,
            autor,
            descripcion,
            fecha_publicacion,
            genero,
            imagen
        });

        const savedBook = await newBook.save(); // Guardar el libro en MongoDB
        res.status(201).json({ message: 'Book added successfully!', libro: savedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el libro' });
    }
};

// Actualizar un libro por ID, incluyendo la imagen
exports.updateBook = async (req, res) => {
    try {
        const { titulo, autor, descripcion, fecha_publicacion, genero } = req.body;
        let imagen = req.body.imagen; // Mantener la imagen existente por defecto

        if (req.file) {
            imagen = `/uploads/${req.file.filename}`; // Ruta de la nueva imagen si se sube
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                titulo,
                autor,
                descripcion,
                fecha_publicacion,
                genero,
                imagen
            },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.json({ message: 'Book updated successfully!', libro: updatedBook });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el libro' });
    }
};

// Eliminar un libro por ID
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id); // Eliminar el libro usando Mongoose
        if (!deletedBook) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json({ message: 'Book deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el libro' });
    }
};
