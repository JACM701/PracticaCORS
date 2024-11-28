// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo'; // Usa el mismo que en la creación de tokens

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Obtén el token después de "Bearer"
  if (!token) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY); // Valida el token
    req.user = verified; // Asigna la información del usuario (id, role) al request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token no válido' });
  }
};

module.exports = authenticateToken;
