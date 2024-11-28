// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo';

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token de acceso no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // Adjunta el usuario autenticado al request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token no válido' });
    }
};

const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRole };