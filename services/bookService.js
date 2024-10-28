const bookRepository = require('../repositories/bookRepository');

// Obtener todos los libros
exports.getAllBooks = () => {
    return bookRepository.getAllBooks();
};

// Obtener un libro por ID
exports.getBookById = (id) => {
    return bookRepository.getBookById(id);
};

// Añadir un nuevo libro
exports.addBook = (newBook) => {
    return bookRepository.addBook(newBook);
};

// Actualizar un libro existente por ID
exports.updateBook = (id, updatedBook) => {
    return bookRepository.updateBook(id, updatedBook);
};

// Eliminar un libro por ID
exports.deleteBook = (id) => {
    return bookRepository.deleteBook(id);
};


// Obtener libros por propietario
exports.getBooksByOwner = async (req, res) => {
    try {
        const books = await Book.find({ propietario: req.user.id });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los libros del propietario' });
    }
};
