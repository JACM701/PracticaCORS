const multer = require('multer');
const path = require('path');
const bookService = require('../services/bookService');

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
exports.getAllBooks = (req, res) => {
    const books = bookService.getAllBooks();
    res.json(books);
};

// Obtener un libro por ID
exports.getBookById = (req, res) => {
    const id = parseInt(req.params.id); // Obtener el ID desde los parámetros
    const book = bookService.getBookById(id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Libro no encontrado' });
    }
};

// Añadir libros ahora con imágenes
exports.addBook = (req, res) => {
    const { id, titulo, autor, descripcion, fecha_publicacion, genero } = req.body;

    // Verifica si se subió una imagen
    let imagen = '';
    if (req.file) {
        imagen = `/uploads/${req.file.filename}`; // Guarda la ruta de la imagen
    }

    // Crear un nuevo libro con la imagen
    const newBook = {
        id: parseInt(id),  // Asegurar que el ID sea numérico
        titulo,
        autor,
        descripcion,
        fecha_publicacion,
        genero,
        imagen // Añadir la ruta de la imagen al objeto libro
    };

    console.log("Libro recibido en el cuerpo de la solicitud:", newBook); // Para depurar

    // Llamar al servicio para agregar el libro
    bookService.addBook(newBook);

    // Respuesta
    res.status(201).json({ message: 'Book added successfully!', libro: newBook });
};

// Actualizar un libro por ID, incluyendo la imagen
exports.updateBook = (req, res) => {
    const id = parseInt(req.params.id); // Obtener el ID desde los parámetros
    const { titulo, autor, descripcion, fecha_publicacion, genero } = req.body;

    // Comprobar si se ha subido una imagen nueva
    let imagen = '';
    if (req.file) {
        imagen = `/uploads/${req.file.filename}`; // Ruta de la nueva imagen
    }

    const updatedBook = {
        id,
        titulo,
        autor,
        descripcion,
        fecha_publicacion,
        genero,
        ...(imagen && { imagen }) // Solo añadir la imagen si existe
    };

    const result = bookService.updateBook(id, updatedBook);

    if (result) {
        res.json({ message: 'Book updated successfully!', libro: updatedBook });
    } else {
        res.status(404).json({ message: 'Book not found!' });
    }
};

// Eliminar libro por ID
exports.deleteBook = (req, res) => {
    const id = parseInt(req.params.id); // Obtener el ID desde los parámetros
    
    // Llama al servicio para eliminar el libro
    const result = bookService.deleteBook(id);

    if (result) {
        res.json({ message: 'Book deleted successfully!' });
    } else {
        res.status(404).json({ message: 'Book not found!' });
    }
};
