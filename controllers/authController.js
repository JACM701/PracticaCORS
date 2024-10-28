// controllers/authController.js

const authService = require('../services/authService');

// Registro de usuario
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = await authService.createUser(username, password);
        res.status(201).json({ message: 'Usuario creado', user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await authService.authenticateUser(username, password);

        if (!token) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        res.json({ auth: true, token });
    } catch (error) {
        res.status(500).json({ message: 'Error en la autenticación' });
    }
};
