// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo';
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas';

// Crear nuevo usuario
exports.createUser = async (username, email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user',
    });

    await newUser.save();
    return { username: newUser.username, email: newUser.email };
};

// Autenticar usuario y generar tokens
exports.authenticateUser = async (username, password) => {
    const user = await User.findOne({ username });
    
    if (!user) {
        console.log("Usuario no encontrado");
        return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    console.log("Contraseña válida:", isPasswordValid);

    if (!isPasswordValid) {
        return null;
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

// Refrescar el token de acceso
exports.refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, SECRET_KEY, { expiresIn: '1h' });
        return newAccessToken;
    } catch (error) {
        throw new Error('Token de refresco no válido');
    }
};
