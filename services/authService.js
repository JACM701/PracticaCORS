// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Obtén las claves secretas desde el entorno o utiliza valores por defecto.
const secretKey = process.env.JWT_SECRET || 'SueñitosTieneHambreTodoElTiempo';
const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'CachorroLeGustaLasGomitasMagicas';

// Generar el token de acceso
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
};

// Generar el token de refresco
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, refreshSecretKey, { expiresIn: '7d' });
};

// Crear un nuevo usuario
const createUser = async (username, email, password) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Usuario ya existe');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return newUser;
};

// En services/authService.js
const authenticateUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) return null; // Usuario no encontrado

    const passwordIsValid = await user.comparePassword(password);
    if (!passwordIsValid) return null; // Contraseña incorrecta

    // Generar tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Almacenar el refresh token en la base de datos del usuario
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
};


// Refrescar token
const refreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, refreshSecretKey);
        const user = await User.findById(decoded.id);

        // Verificar si el refreshToken coincide con el almacenado
        if (!user || user.refreshToken !== token) throw new Error('Token de refresco no válido');

        // Generar un nuevo token de acceso
        const newAccessToken = generateAccessToken(user);
        return newAccessToken;
    } catch (error) {
        throw new Error('Token de refresco no válido');
    }
};

module.exports = { createUser, authenticateUser, refreshToken };
