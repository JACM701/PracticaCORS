//services/authService
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const secretKey = 'SueñitosTieneHambreTodoElTiempo';
const refreshSecretKey = 'CachorroLeGustaLasGomitasMagicas'; // Nueva clave para el refresh token

// Función para generar el token de acceso
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
};

// Función para generar el refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, refreshSecretKey, { expiresIn: '7d' });
};

// Crear un nuevo usuario
const createUser = async (username, password) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Usuario ya existe');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    return newUser;
};

// Autenticar al usuario
const authenticateUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) return null;

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return null;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};

// Refrescar token
const refreshToken = async (token) => {
    // Validar el refresh token y generar un nuevo access token
    try {
        const decoded = jwt.verify(token, refreshSecretKey);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('Usuario no encontrado');

        const newAccessToken = generateAccessToken(user);
        return newAccessToken;
    } catch (error) {
        throw new Error('Token de refresco no válido');
    }
};

module.exports = { generateAccessToken, generateRefreshToken, createUser, authenticateUser, refreshToken };
