const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Modelo de usuario
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo'; // Cambia esto a una variable de entorno en producción
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas'; // Para el refresh token

// Crear nuevo usuario con contraseña encriptada
exports.createUser = async (username, email, password) => {
    try {
        const hashedPassword = bcrypt.hashSync(password, 8);  // Encripta la contraseña
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });

        await newUser.save();
        console.log('Usuario creado exitosamente:', { username: newUser.username, email: newUser.email });
        return { username: newUser.username, email: newUser.email };
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        throw error;
    }
};

// Autenticar usuario comparando contraseñas encriptadas
exports.authenticateUser = async (username, password) => {
    try {
        console.log('Datos de inicio de sesión recibidos:', { username, password });

        const user = await User.findOne({ username });
        if (!user) {
            console.log('Usuario no encontrado');
            return null;
        }

        // Compara la contraseña ingresada con la almacenada encriptada
        const passwordIsValid = await bcrypt.compare(password, user.password);
        console.log('¿Contraseña válida?', passwordIsValid); // Verificar resultado de comparación

        if (!passwordIsValid) {
            console.log('La contraseña no coincide');
            return null;  // Contraseña incorrecta
        }

        // Generar tokens si la autenticación es exitosa
        const accessToken = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
        
        console.log('Tokens retornados al cliente:', { accessToken, refreshToken });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error al autenticar usuario:', error.message);
        throw error;
    }
};

// Refrescar el token de acceso
exports.refreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, SECRET_KEY, { expiresIn: '1h' });
        return newAccessToken;
    } catch (error) {
        console.error('Token de refresco no válido:', error.message);
        throw new Error('Token de refresco no válido');
    }
};
