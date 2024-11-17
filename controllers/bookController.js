// controllers/bookController.js
const Book = require('../models/bookModel');
const bookService = require('../services/bookServices');

// Obtener todos los libros
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los libros' });
    }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el libro' });
    }
};

// Agregar un nuevo libro
exports.addBook = async (req, res) => {
    try {
        const newBook = new Book({
            titulo: req.body.titulo,
            autor: req.body.autor,
            descripcion: req.body.descripcion,
            fecha_publicacion: req.body.fecha_publicacion,
            genero: req.body.genero,
            imagen: req.file ? `/uploads/${req.file.filename}` : null,
            edicion: req.body.edicion,
            ano_publicado: req.body.ano_publicado,
            tipo_pasta: req.body.tipo_pasta,
            editorial: req.body.editorial,
            incluye_accesorios: req.body.incluye_accesorios,
            propietario: req.user.id // Asignamos el ID del usuario autenticado
        });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el libro' });
    }
};

// Actualizar un libro
exports.updateBook = async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                titulo: req.body.titulo,
                autor: req.body.autor,
                descripcion: req.body.descripcion,
                fecha_publicacion: req.body.fecha_publicacion,
                genero: req.body.genero,
                imagen: req.file ? `/uploads/${req.file.filename}` : req.body.imagen,
                edicion: req.body.edicion,
                ano_publicado: req.body.ano_publicado,
                tipo_pasta: req.body.tipo_pasta,
                editorial: req.body.editorial,
                incluye_accesorios: req.body.incluye_accesorios
            },
            { new: true }
        );
        if (!updatedBook) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el libro' });
    }
};

// Eliminar un libro
exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el libro' });
    }
};

// Obtener libros paginados
exports.getPaginatedBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual (default: 1)
        const limit = parseInt(req.query.limit) || 10; // Límite por página (default: 10)

        const paginatedData = await bookService.getPaginatedBooks(page, limit);

        res.status(200).json(paginatedData); // Enviar datos paginados al cliente
    } catch (error) {
        console.error('Error al obtener libros paginados:', error);
        res.status(500).json({ message: 'Error al obtener libros paginados' });
    }
};
