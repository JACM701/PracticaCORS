const fs = require('fs');
const path = require('path');
const BookModel = require('../models/bookModel'); // Importa el modelo de Mongoose

// Obtener todos los libros
exports.getAllBooks = async () => {
    try {
        const books = await BookModel.find(); // Obtener todos los libros de MongoDB
        return books;
    } catch (error) {
        console.error('Error al obtener todos los libros:', error);
        throw error;
    }
};

// Obtener un libro por ID
exports.getBookById = async (id) => {
    try {
        const book = await BookModel.findById(id); // Obtener libro por ID en MongoDB
        return book;
    } catch (error) {
        console.error('Error al obtener libro por ID:', error);
        throw error;
    }
};

// Añadir un nuevo libro
exports.addBook = async (newBook) => {
    try {
        const book = new BookModel(newBook); // Crear una instancia del modelo
        await book.save(); // Guardar el nuevo libro en MongoDB
        return book;
    } catch (error) {
        console.error('Error al añadir un nuevo libro:', error);
        throw error;
    }
};

// Actualizar un libro existente por ID
exports.updateBook = async (id, updatedBook) => {
    try {
        const book = await BookModel.findByIdAndUpdate(id, updatedBook, { new: true }); // Actualizar libro por ID
        return book;
    } catch (error) {
        console.error('Error al actualizar libro por ID:', error);
        throw error;
    }
};

// Eliminar un libro por ID
exports.deleteBook = async (id) => {
    try {
        await BookModel.findByIdAndDelete(id); // Eliminar libro por ID en MongoDB
        return { message: 'Libro eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar libro por ID:', error);
        throw error;
    }
};

