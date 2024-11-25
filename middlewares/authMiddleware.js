// middlewares/authMiddleware.js
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("Header Authorization:", authHeader);
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Token no proporcionado o formato incorrecto");
      return res.status(401).json({ message: 'Token de acceso no proporcionado' });
    }
  
    const token = authHeader.split(' ')[1];
    console.log("Token extraído:", token);
    
    if (!token) {
      console.log("Token vacío");
      return res.status(401).json({ message: 'Token de acceso no proporcionado' });
    }
  
    try {
      const verified = jwt.verify(token, SECRET_KEY); // Verifica el token
      console.log("Token verificado con éxito:", verified);
      req.user = verified; // Asigna la información del usuario al request
      next();
    } catch (error) {
      console.log("Error al verificar el token:", error);
      return res.status(403).json({ message: 'Token no válido', error: error.message });
    }
  };
  
module.exports = authenticateToken;

