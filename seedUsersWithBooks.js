const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('./models/userModel');
const Book = require('./models/bookModel');

// Configuración de la conexión a MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Función para insertar documentos en lotes
async function insertInBatches(documents, batchSize, model) {
    for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        await model.insertMany(batch);
        console.log(`Batch de ${batch.length} documentos insertado.`);
    }
}

// Función para autenticar el usuario en la API
async function authenticateUser() {
    try {
        const response = await axios.post('https://api-bookswap.onrender.com/login', {
            email: 'admin@example.com', // Cambia esto a un usuario que sí exista
            password: 'password123',
        });
        return response.data.accessToken;
    } catch (error) {
        console.error('Error al autenticar:', error.response?.data || error.message);
        return null;
    }
}

// Función para registrar el usuario en la API
async function registerUserInAPI(user, token) {
    try {
        const response = await axios.post('https://api-bookswap.onrender.com/register', {
            username: user.username,
            email: user.email,
            password: 'password123',
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message === 'Usuario ya existe') {
            console.log(`El usuario ${user.username} ya existe. Ignorando...`);
            return null;  // Ignorar si el usuario ya existe
        }
        console.error(`Error al registrar usuario ${user.username}:`, error.response?.data || error.message);
        return null;
    }
}

// Función para añadir 1000 usuarios con sus 1000 libros
async function seedUsersWithBooks() {
    try {
        await User.deleteMany({});
        await Book.deleteMany({});

        const usersSet = new Set();
        const users = [];
        for (let i = 0; i < 1000; i++) {
            let email, username;

            // Generar un correo único
            do {
                email = faker.internet.email();
            } while (usersSet.has(email));
            usersSet.add(email);

            // Generar un nombre de usuario único
            do {
                username = faker.internet.userName();
            } while (usersSet.has(username));
            usersSet.add(username);

            const hashedPassword = bcrypt.hashSync('password123', 8);

            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                role: faker.helpers.arrayElement(['user', 'admin']),
            });

            users.push(user);
        }

        // Insertar usuarios en lotes de 100
        const savedUsers = await User.insertMany(users);
        console.log('1000 usuarios agregados exitosamente');

        const token = await authenticateUser(); // Autenticarse antes de registrar usuarios
        if (!token) return; // Si no se puede autenticar, salir

        for (const user of savedUsers) {
            const registration = await registerUserInAPI(user, token);
            if (!registration) continue; // Ignorar si el registro falla

            const books = [];
            for (let j = 0; j < 1000; j++) {
                const book = new Book({
                    titulo: faker.lorem.words(3),
                    autor: faker.name.findName(),
                    descripcion: faker.lorem.sentence(),
                    fecha_publicacion: faker.date.past(20),
                    genero: faker.music.genre(),
                    imagen: faker.image.imageUrl(),
                    edicion: faker.random.word(),
                    ano_publicado: faker.date.past().getFullYear(),
                    tipo_pasta: faker.helpers.arrayElement(['Dura', 'Suave']),
                    editorial: faker.company.companyName(),
                    incluye_accesorios: faker.datatype.boolean(),
                    propietario: user._id,
                });
                books.push(book);
            }

            await insertInBatches(books, 100, Book);
            console.log(`1000 libros agregados para el usuario ${user.username}`);
        }
    } catch (error) {
        console.error('Error al agregar usuarios y libros:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Ejecutar la función para poblar la base de datos
seedUsersWithBooks();
