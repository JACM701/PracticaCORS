// seedUsersWithBooks.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const User = require('./models/userModel');
const Book = require('./models/bookModel');

// Configuración de la conexión a MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap';

mongoose.connect(mongoURI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Función para registrar usuarios en la base de datos
async function registerUserInDB(username, email, password, role) {
    const user = new User({
        username,
        email,
        password, // Asegúrate de que el modelo User tenga un middleware para encriptar esta contraseña.
        role,
    });
    await user.save();
    return user;
}

// Función para autenticar usuarios y obtener un token
async function authenticateUser(username, password) {
    try {
        const response = await axios.post('https://api-bookswap.onrender.com/login', {
            username,
            password,
        });
        return response.data.accessToken; // Retorna el token de acceso
    } catch (error) {
        console.error(`Error al autenticar al usuario ${username}:`, error.response?.data || error.message);
        return null;
    }
}

// Función para añadir usuarios con libros
async function seedUsersWithBooks() {
    try {
        await User.deleteMany({});
        await Book.deleteMany({});

        const usersSet = new Set();

        for (let i = 0; i < 1000; i++) {
            let email, username;

            // Generación de email único
            do {
                email = faker.internet.email();
            } while (usersSet.has(email));
            usersSet.add(email);

            // Generación de nombre de usuario único
            do {
                username = faker.internet.username(); // Cambiado a `username` en lugar de `userName`
            } while (usersSet.has(username));
            usersSet.add(username);

            // Registro de usuario
            const user = await registerUserInDB(username, email, 'password123', 'user');
            console.log(`Usuario registrado: ${username}`);

            // Autenticación del usuario para obtener token
            const token = await authenticateUser(username, 'password123');
            if (!token) {
                console.error(`No se pudo autenticar al usuario ${username}, saltando...`);
                continue;
            }

            // Crear libros para el usuario
            for (let j = 0; j < 10; j++) {
                const book = {
                    titulo: faker.lorem.words(3),
                    autor: faker.person.fullName(),
                    descripcion: faker.lorem.sentence(),
                    fecha_publicacion: faker.date.past(20),
                    genero: faker.music.genre(),
                    imagen: faker.image.url(),
                    edicion: faker.word.noun(), // Cambiado a `word.noun()` en lugar de `random.word()`
                    ano_publicado: faker.date.past().getFullYear(),
                    tipo_pasta: faker.helpers.arrayElement(['Dura', 'Suave']),
                    editorial: faker.company.name(),
                    incluye_accesorios: faker.datatype.boolean(),
                    propietario: user._id,
                };

                try {
                    // Solicitud para crear un libro
                    await axios.post('https://api-bookswap.onrender.com/books', book, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log(`Libro creado para el usuario ${username}: ${book.titulo}`);
                } catch (error) {
                    console.error(`Error al crear libro para el usuario ${username}:`, error.response?.data || error.message);
                }
            }
            console.log(`Libros creados para el usuario ${username}`);
        }
    } catch (error) {
        console.error('Error al agregar usuarios y libros:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Ejecutar la función para poblar la base de datos
seedUsersWithBooks();
