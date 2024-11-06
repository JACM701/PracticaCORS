const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Modelo de usuario
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo'; // Cambia esto a una variable de entorno en producción
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas'; // Para el refresh token

// Crear nuevo usuario con contraseña encriptada
exports.createUser = async (username, email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 8);  // Encripta la contraseña
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user',
    });

    await newUser.save();
    return { username: newUser.username, email: newUser.email };
};

// Autenticar usuario comparando contraseñas encriptadas
exports.authenticateUser = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        return null;  // Usuario no encontrado
    }

    // Compara la contraseña ingresada con la almacenada encriptada
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return null;  // Contraseña incorrecta
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
