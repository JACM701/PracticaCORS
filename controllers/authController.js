// controllers/authController.js
const authService = require('../services/authService');

// Registro de usuario
exports.register = async (req, res) => {
    const { username, email, password } = req.body; // Extraemos los datos del cuerpo de la solicitud

    try {
        // Llamamos al servicio para registrar al usuario
        const newUser = await authService.registerUser(username, email, password);
        console.log('Usuario creado:', newUser);

        // Enviamos la respuesta exitosa al cliente
        res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Enviamos la respuesta de error al cliente
        res.status(400).json({ message: error.message });
    }
};

// Inicio de sesión y generación de tokens
exports.login = async (req, res) => {
    console.log('Datos de inicio de sesión recibidos:', req.body);
    const { username, password } = req.body;

    try {
        const tokens = await authService.authenticateUser(username, password);
        console.log('Tokens retornados al cliente:', tokens);

        if (!tokens) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        res.json({ auth: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Refrescar el token de acceso
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const newAccessToken = await authService.refreshToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Token de refresco no válido' });
    }
};
