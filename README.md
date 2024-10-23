# Mi Proyecto


Antes en el BookModel estaba esto que era para un JSON
const filePath = path.join(__dirname, '../books.json');

// Función para leer los libros desde el archivo JSON
const getBooksFromFile = () => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// Función para guardar los libros en el archivo JSON
const saveBooksToFile = (books) => {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2), 'utf-8');
};

// Obtener todos los libros
exports.getAllBooks = () => {
    return getBooksFromFile();
};

// Añadir un nuevo libro
exports.addBook = (newBook) => {
    const books = getBooksFromFile();
    books.push(newBook); // Añade el nuevo libro al array
    saveBooksToFile(books); // Guarda los cambios en el archivo JSON
};

// Buscar un libro por ID
exports.getBookById = (id) => {
    const books = getBooksFromFile();
    return books.find(book => book.id === id);
};

// Actualizar un libro existente por ID
exports.updateBook = (id, updatedBook) => {
    const books = getBooksFromFile();
    const bookIndex = books.findIndex(book => book.id === id); // Buscar por ID

    if (bookIndex !== -1) {
        // Actualiza el libro existente con los nuevos datos
        books[bookIndex] = { ...books[bookIndex], ...updatedBook };
        saveBooksToFile(books); // Guarda los cambios en el archivo JSON
        return true;
    }
    return false;
};

// Eliminar un libro por ID
exports.deleteBook = (id) => {
    const books = getBooksFromFile();
    const newBooks = books.filter(book => book.id !== id); // Filtrar libros sin el ID dado

    if (newBooks.length !== books.length) {
        saveBooksToFile(newBooks); // Guarda los cambios en el archivo JSON
        return true;
    } else {
        return false; // No se encontró el libro para eliminar
    }
};
