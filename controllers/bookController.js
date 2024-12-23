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

// Aprobar un libro
exports.approveBook = async (req, res) => {
    try {
        // Verificamos si el usuario tiene rol "approver"
        if (req.user.role !== 'approver') {
            return res.status(403).json({ message: 'No tienes permisos para aprobar libros.' });
        }

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }

        // Cambiamos el estado a "approved"
        book.status = 'approved';
        await book.save();

        res.json({ message: 'Libro aprobado exitosamente.', book });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar el libro.', error });
    }
};

// Rechazar un libro
exports.rejectBook = async (req, res) => {
    try {
        // Verificamos si el usuario tiene rol "approver"
        if (req.user.role !== 'approver') {
            return res.status(403).json({ message: 'No tienes permisos para rechazar libros.' });
        }

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado.' });
        }

        // Cambiamos el estado a "rejected"
        book.status = 'rejected';
        await book.save();

        res.json({ message: 'Libro rechazado exitosamente.', book });
    } catch (error) {
        res.status(500).json({ message: 'Error al rechazar el libro.', error });
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
