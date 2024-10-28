// controllers/authController.js

const authService = require('../services/authService');

// Registro de usuario
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await authService.createUser(username, email, password); // Incluye 'email'

        // Genera un token para el nuevo usuario
        const token = authService.generateToken(newUser);

        // Envía el usuario y el token en la respuesta
        res.status(201).json({ message: 'Usuario creado', user: newUser, token });
    } catch (error) {
        res.status(400).json({ message: error.message }); // Manejo de errores
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const token = await authService.authenticateUser(username, password);

    if (!token) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    res.json({ auth: true, token });
};
