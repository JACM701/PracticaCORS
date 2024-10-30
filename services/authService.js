const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Usar bcryptjs en lugar de bcrypt
const User = require('../models/userModel'); // Modelo de usuario
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo';
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas';

// Crear nuevo usuario con encriptación
exports.createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Encripta la contraseña
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user',
    });

    await newUser.save();
    return { username: newUser.username, email: newUser.email };
};

// Autenticar usuario con comparación encriptada
exports.authenticateUser = async (username, password) => {
    const user = await User.findOne({ username });
    
    if (!user) {
        console.log('Usuario no encontrado');
        return null;
    }

    // Verificar la contraseña encriptada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log('La contraseña no coincide');
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
