const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Actualizar a faker.internet.username()
const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('./models/userModel');
const Book = require('./models/bookModel');

// Configuración de la conexión a MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Asegúrate de usar esta opción también
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
async function authenticateUser(username, password) {
    try {
        const response = await axios.post('https://api-bookswap.onrender.com/login', {
            username,
            password,
        });
        return response.data.accessToken; // Devuelve el token de acceso
    } catch (error) {
        console.error(`Error al autenticar usuario ${username}:`, error.response?.data || error.message);
        return null; // Devuelve null si hay un error
    }
}

// Función para registrar el usuario en la base de datos
async function registerUserInDB(username, email, hashedPassword, role) {
    const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
    });
    await user.save(); // Guarda el usuario en la base de datos
    return user; // Devuelve el usuario creado
}

// Función para añadir usuarios con libros
async function seedUsersWithBooks() {
    try {
        await User.deleteMany({}); // Elimina todos los usuarios existentes
        await Book.deleteMany({}); // Elimina todos los libros existentes

        const usersSet = new Set(); // Para asegurar unicidad de correos y nombres de usuario
        
        for (let i = 0; i < 1000; i++) {
            let email, username;

            // Generar un correo único
            do {
                email = faker.internet.email();
            } while (usersSet.has(email));
            usersSet.add(email);

            // Generar un nombre de usuario único
            do {
                username = faker.internet.username(); // Método actualizado
            } while (usersSet.has(username));
            usersSet.add(username);

            const hashedPassword = bcrypt.hashSync('password123', 8); // Hashea la contraseña

            // Registrar usuario en la base de datos
            const user = await registerUserInDB(username, email, hashedPassword, 'user');
            console.log(`Usuario registrado: ${username}`);

            // Autenticar el usuario para obtener su token
            const token = await authenticateUser(username, 'password123');
            if (!token) {
                console.error(`No se pudo autenticar al usuario ${username}, saltando...`);
                continue; // Si falla la autenticación, salta al siguiente usuario
            }

            for (let j = 0; j < 10; j++) { // Genera 10 libros por usuario
                const book = {
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
                    propietario: user._id, // Asocia el libro al usuario creado
                };

                // Crear el libro en la API utilizando el token del usuario
                try {
                    await axios.post('https://api-bookswap.onrender.com/books', book, {
                        headers: { Authorization: `Bearer ${token}` }
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
        mongoose.connection.close(); // Cierra la conexión a la base de datos al final
    }
}

// Ejecutar la función para poblar la base de datos
seedUsersWithBooks();
