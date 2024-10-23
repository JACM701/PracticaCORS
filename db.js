// db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Asegúrate de que el archivo .env esté configurado

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
        process.exit(1); // Termina el proceso si no se puede conectar
    }
};

module.exports = connectDB;
