const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/userModel');
const Book = require('./models/bookModel');

const MONGODB_URI = 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap';
const API_URL = 'https://api-bookswap.onrender.com'; // Cambia esto al URL de tu API

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Generar un nombre de usuario y libro aleatorio
const generateRandomName = () => `User_${Math.floor(Math.random() * 100000)}`;
const generateRandomBookTitle = () => `Book_${Math.floor(Math.random() * 100000)}`;

const seedUsersWithBooks = async () => {
    try {
        for (let i = 0; i < 1000; i++) {
            const username = generateRandomName();
            const password = 'password123';

            // Registrar usuario y obtener tokens
            const registerResponse = await axios.post(`${API_URL}/register`, { username, password });
            const { accessToken, refreshToken } = await loginUser(username, password);

            console.log(`Usuario ${username} registrado y logueado`);

            // Agregar 1000 libros para el usuario
            for (let j = 0; j < 1000; j++) {
                try {
                    const bookTitle = generateRandomBookTitle();
                    const bookResponse = await axios.post(`${API_URL}/books`, {
                        title: bookTitle,
                        author: 'Author XYZ',
                        owner: registerResponse.data.user._id
                    }, { headers: { Authorization: `Bearer ${accessToken}` } });
                    
                    console.log(`Libro ${bookTitle} agregado para el usuario ${username}`);
                } catch (error) {
                    // Si el token expiró, usar el refresh token para obtener un nuevo access token
                    if (error.response && error.response.status === 401) {
                        console.log(`Access token expirado para ${username}. Generando nuevo token...`);
                        const newAccessToken = await refreshAccessToken(refreshToken);
                        accessToken = newAccessToken;
                    } else {
                        console.error(`Error al agregar libro para ${username}:`, error.message);
                        break;
                    }
                }
            }
        }
        console.log('Seed de usuarios y libros completada.');
    } catch (error) {
        console.error('Error al agregar usuarios y libros:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Función para iniciar sesión y obtener tokens
const loginUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
};

// Función para refrescar el access token usando el refresh token
const refreshAccessToken = async (refreshToken) => {
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
    return response.data.accessToken;
};

seedUsersWithBooks();
