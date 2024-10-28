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
