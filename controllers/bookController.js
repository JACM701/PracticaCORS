// controllers/bookController.js
const Book = require('../models/bookModel');

// Ruta para obtener los libros con paginado
const getBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Página predeterminada es la 1
    const limit = parseInt(req.query.limit) || 10; // Limite predeterminado es 10
    const skip = (page - 1) * limit;  // Cálculo del número de documentos a omitir

    try {
        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments(); // Total de libros en la base de datos

        return res.json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error al obtener los libros', error: err });
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
