const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
        }
        next();
    };
};

module.exports = verifyRole;
