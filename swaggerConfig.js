// swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BookSwap API',
            version: '1.0.0',
            description: 'API para intercambio de libros',
        },
        servers: [
            {
                url: 'https://api-bookswap.onrender.com', // Cambia a la URL de tu API
            },
        ],
    },
    apis: ['./routes/*.js', './controllers/*.js'], // Define los archivos donde están tus rutas y controladores
};

const specs = swaggerJsdoc(options);

module.exports = specs;
