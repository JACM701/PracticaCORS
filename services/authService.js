//-Services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Importa el modelo de usuario

// Claves secretas (usa variables de entorno en producción)
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo'; // Clave secreta para tokens de acceso
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas'; // Clave secreta para tokens de refresco

// Crear un nuevo usuario
exports.registerUser = async (username, email, password) => {
    try {
        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Usuario ya existe'); // Lanza un error si el usuario ya existe
        }

        // Crea el usuario sin hashear la contraseña aquí
        const newUser = new User({
            username,
            email,
            password, // La contraseña se hasheará automáticamente con el middleware pre('save')
            role: 'user',
        });

        const savedUser = await newUser.save();

        // Devuelve el _id, username y email del usuario registrado
        return { 
            _id: savedUser._id, 
            username: savedUser.username, 
            email: savedUser.email 
        };
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw new Error(error.message); // Lanza el error para que lo maneje el controlador
    }
};


// Autenticación de usuario
exports.authenticateUser = async (username, password) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Usuario no encontrado");
            return null;
        }

        // Usa el método comparePassword del modelo para verificar la contraseña
        const passwordIsValid = await user.comparePassword(password);
        console.log("¿Contraseña válida?", passwordIsValid);

        if (!passwordIsValid) {
            console.log("La contraseña no coincide");
            return null;
        }

        // Genera tokens
        const accessToken = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

        console.log("Tokens retornados al cliente:", { accessToken, refreshToken });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error en autenticación:", error.message);
        throw new Error("Error al autenticar el usuario");
    }
};

// Refrescar el token de acceso usando el token de refresco
exports.refreshToken = async (refreshToken) => {
    try {
        // Verifica el token de refresco
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

        // Genera un nuevo token de acceso usando los datos del usuario decodificados
        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, SECRET_KEY, { expiresIn: '1h' });
        
        return newAccessToken; // Retorna el nuevo token de acceso al cliente
    } catch (error) {
        console.error('Token de refresco no válido:', error.message);
        throw new Error('Token de refresco no válido'); // Lanza un error si el token de refresco es inválido
    }
};
