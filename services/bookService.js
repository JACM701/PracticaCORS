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
exports.updateBook = (id, updatedBook) => {
    return bookRepository.updateBook(id, updatedBook);
};

// Eliminar un libro por ID
exports.deleteBook = (id) => {
    return bookRepository.deleteBook(id);
};

// Obtener libros paginados
exports.getPaginatedBooks = async (page, limit) => {
    try {
        const skip = (page - 1) * limit; // Cálculo del desplazamiento
        const { books, totalRecords } = await bookRepository.getPaginatedBooks(skip, limit);
        const totalPages = Math.ceil(totalRecords / limit); // Total de páginas

        return {
            books,
            totalRecords,
            totalPages,
            currentPage: page,
            limit,
        };
    } catch (error) {
        console.error('Error al obtener libros paginados:', error);
        throw error;
    }
};
