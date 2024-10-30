// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'SueñitosTieneHambreTodoElTiempo';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Obtener el token

    if (!token) return res.sendStatus(401); // Si no hay token, devuelve 401

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Si el token es inválido, devuelve 403
        req.user = user; // Guarda la información del usuario en la solicitud
        next(); // Continua a la siguiente función
    });
};

module.exports = authenticateToken;
