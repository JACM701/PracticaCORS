// seedUsers.js
const mongoose = require('mongoose');
const faker = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel'); // Asegúrate de que la ruta al modelo sea correcta

const mongoURI = 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap'; // Reemplaza con tu URI de conexión a MongoDB

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

async function seedUsers() {
    try {
        const users = [];
        for (let i = 0; i < 1000; i++) {
            const hashedPassword = bcrypt.hashSync('password123', 8); // Contraseña común para todos

            const user = new User({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: faker.helpers.arrayElement(['user', 'admin']),
            });

            users.push(user);
        }

        await User.insertMany(users);
        console.log('1000 usuarios agregados exitosamente');
    } catch (error) {
        console.error('Error al agregar usuarios:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedUsers();
