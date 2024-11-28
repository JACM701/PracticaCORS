//services/bookServices.js
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
exports.updateBook = async (id, userId, updatedBook) => {
    const book = await bookRepository.getBookById(id);
    if (!book) throw new Error('Libro no encontrado');
    if (book.propietario.toString() !== userId) throw new Error('No autorizado para modificar este libro');
    return bookRepository.updateBook(id, updatedBook);
};

// Eliminar un libro por ID
exports.deleteBook = async (id, userId) => {
    const book = await bookRepository.getBookById(id);
    if (!book) throw new Error('Libro no encontrado');
    if (book.propietario.toString() !== userId) throw new Error('No autorizado para eliminar este libro');
    return bookRepository.deleteBook(id);
};
