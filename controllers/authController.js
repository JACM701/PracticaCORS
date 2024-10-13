// controllers/authController.js

const authService = require('../services/authService');

// Registro de usuario
exports.register = (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = authService.createUser(username, password);
        res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message }); // Manejo de errores
    }
};

// Iniciar sesión
exports.login = (req, res) => {
    const { username, password } = req.body;
    const token = authService.authenticateUser(username, password);

    if (!token) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    res.json({ auth: true, token });
};
