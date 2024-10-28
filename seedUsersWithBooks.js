// seedUsersWithBooks.js
const mongoose = require('mongoose');
const faker = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel'); // Ajusta la ruta según tu proyecto
const Book = require('./models/bookModel'); // Ajusta la ruta según tu proyecto

const mongoURI = 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap'; // Reemplaza con tu URI de MongoDB

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

async function seedUsersWithBooks() {
    try {
        const users = [];
        for (let i = 0; i < 1000; i++) {
            const hashedPassword = bcrypt.hashSync('password123', 8);

            const user = new User({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: faker.helpers.arrayElement(['user', 'admin']),
            });

            users.push(user);
        }

        const savedUsers = await User.insertMany(users);
        console.log('1000 usuarios agregados exitosamente');

        const books = [];
        for (const user of savedUsers) {
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

                // Insertar en lotes de 1000 para evitar desbordamiento de memoria
                if (books.length >= 1000) {
                    await Book.insertMany(books);
                    console.log(`1000 libros agregados para el usuario ${user.username}`);
                    books.length = 0; // Vaciar el arreglo de libros
                }
            }
        }

        if (books.length > 0) {
            await Book.insertMany(books);
            console.log('Libros restantes agregados.');
        }

    } catch (error) {
        console.error('Error al agregar usuarios y libros:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedUsersWithBooks();
