// services/authService.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = 'SueñitosTieneHambreTodoElTiempo'; // Cambia esto por una clave más segura

let users = []; // Arreglo para almacenar usuarios

// Función para generar un token
const generateToken = (user) => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' }); // El token expira en 1 hora
};

// Función para crear un nuevo usuario
const createUser = (username, password) => {
    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        throw new Error('Usuario ya existe'); // Lanza un error si el usuario ya existe
    }

    const hashedPassword = bcrypt.hashSync(password, 8); // Hashea la contraseña
    const newUser = { username, password: hashedPassword }; // Crear un nuevo objeto de usuario
    users.push(newUser); // Guardar el usuario en el arreglo
    return newUser;
};

// Función para autenticar al usuario
const authenticateUser = (username, password) => {
    const user = users.find(user => user.username === username); // Busca el usuario
    if (!user) return null; // Si el usuario no existe, retorna null

    const passwordIsValid = bcrypt.compareSync(password, user.password); // Compara la contraseña
    if (!passwordIsValid) return null; // Si la contraseña es inválida, retorna null

    return generateToken({ username: user.username }); // Genera el token
};

module.exports = { generateToken, createUser, authenticateUser };
