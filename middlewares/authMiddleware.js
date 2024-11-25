// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SueñitosTieneHambreTodoElTiempo';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso no proporcionado' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified; // Esto debería contener { id, role }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token no válido' });
  }
};

module.exports = authenticateToken;
