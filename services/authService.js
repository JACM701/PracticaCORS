const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Importa el modelo de usuario

// Claves secretas (usa variables de entorno en producción)
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo'; // Clave secreta para tokens de acceso
const REFRESH_SECRET_KEY = 'CachorroLeGustaLasGomitasMagicas'; // Clave secreta para tokens de refresco

// Crear un nuevo usuario y hashear la contraseña
exports.createUser = async (username, email, password) => {
    try {
        // Genera un hash de la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10); // Factor de costo 10 (valor seguro por defecto)
        console.log("Contraseña hasheada para el usuario:", hashedPassword);

        // Crea una nueva instancia de usuario con la contraseña hasheada
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user', // Asigna el rol de usuario por defecto
        });

        // Guarda el usuario en la base de datos
        await newUser.save();
        console.log('Usuario creado exitosamente:', { username: newUser.username, email: newUser.email });
        
        // Devuelve solo la información necesaria (excluyendo la contraseña)
        return { username: newUser.username, email: newUser.email };
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        throw error; // Lanza el error para manejarlo en el controlador
    }
};

// Autenticar al usuario y generar tokens
exports.authenticateUser = async (username, password) => {
    try {
        // Busca el usuario en la base de datos por nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            console.log("Usuario no encontrado");
            return null; // Si el usuario no existe, devuelve null
        }

        console.log("Contraseña en la base de datos:", user.password);
        console.log("Contraseña ingresada:", password);

        // Compara la contraseña ingresada con la hasheada en la base de datos
        const passwordIsValid = await bcrypt.compare(password, user.password);
        console.log("¿Contraseña válida?", passwordIsValid);

        if (!passwordIsValid) {
            console.log("La contraseña no coincide");
            return null; // Si la contraseña no coincide, devuelve null
        }

        // Genera el token de acceso y el token de refresco
        const accessToken = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

        console.log("Tokens retornados al cliente:", { accessToken, refreshToken });
        return { accessToken, refreshToken }; // Devuelve ambos tokens al cliente
    } catch (error) {
        console.error("Error en autenticación:", error.message);
        throw error; // Lanza el error para manejarlo en el controlador
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
