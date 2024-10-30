// controllers/authController.js

const authService = require('../services/authService');

// Registro de usuario
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = await authService.createUser(username, password);
        const tokens = await authService.authenticateUser(username, password); // Generar tokens después del registro
        res.status(201).json({ 
            message: 'Usuario creado', 
            user: newUser, 
            accessToken: tokens.accessToken, 
            refreshToken: tokens.refreshToken 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Inicio de sesión y generación de tokens
exports.login = async (req, res) => {
    const { username, password } = req.body; 
    try {
        const tokens = await authService.authenticateUser(username, password);
        
        if (!tokens) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        res.json({ auth: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (error) {
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
