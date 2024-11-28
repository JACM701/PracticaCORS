// controllers/bookController.js
const Book = require('../models/bookModel');

// Obtener todos los libros con paginación
exports.getAllBooks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Página y límite predeterminados

    try {
        const books = await Book.find()
            .skip((page - 1) * limit) // Saltar libros según la página
            .limit(parseInt(limit)); // Limitar la cantidad por página

        const total = await Book.countDocuments(); // Total de libros

        res.json({
            data: books,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalBooks: total
        });
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

// Añadir un libro
exports.addBook = async (req, res) => {
    try {
        const { titulo, autor, descripcion, fecha_publicacion, genero, edicion, ano_publicado, tipo_pasta, editorial, incluye_accesorios } = req.body;

        // Validación de entrada
        if (!titulo || !autor || !fecha_publicacion || !genero || !ano_publicado || !editorial) {
            return res.status(400).json({ message: 'Por favor, proporciona todos los campos requeridos' });
        }

        const newBook = {
            titulo,
            autor,
            descripcion,
            fecha_publicacion,
            genero,
            edicion,
            ano_publicado,
            tipo_pasta,
            editorial,
            incluye_accesorios,
            propietario: req.user.id, // Asegura que el usuario autenticado sea el propietario
            imagen: req.file ? `/uploads/${req.file.filename}` : null, // Subida opcional de imagen
        };

        const savedBook = await bookService.addBook(newBook);
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error al añadir el libro', error: error.message });
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
