const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Importa el modelo de usuario
const secretKey = 'SueñitosTieneHambreTodoElTiempo'; // Cambia esto por una clave más segura

// Función para generar un token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' }); // Token expira en 1 hora
};

// Función para crear un nuevo usuario
const createUser = async (username, password) => {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Usuario ya existe'); // Lanza un error si el usuario ya existe
    }

    // Hashea la contraseña y crea el nuevo usuario
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, password: hashedPassword });

    // Guarda el usuario en la base de datos
    await newUser.save();
    return newUser;
};

// Función para autenticar al usuario
const authenticateUser = async (username, password) => {
    // Busca el usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) return null; // Si el usuario no existe, retorna null

    // Verifica la contraseña
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return null;

    // Genera y retorna el token
    return generateToken(user);
};

module.exports = { generateToken, createUser, authenticateUser };
