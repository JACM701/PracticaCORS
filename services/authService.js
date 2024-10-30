const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Modelo de usuario
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo'; // Cambia esto a una variable de entorno en producción
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas'; // Para el refresh token

// Crear nuevo usuario sin encriptar contraseña
exports.createUser = async (username, email, password) => {
    const newUser = new User({
        username,
        email,
        password,  // Guarda la contraseña en texto plano
        role: 'user',
    });

    await newUser.save();
    return { username: newUser.username, email: newUser.email };
};

// Autenticar usuario sin encriptación
exports.authenticateUser = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
        return null;  // Verifica directamente con la contraseña en texto plano
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
