// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios con paginación
exports.getAllUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Valores predeterminados: página 1, 10 usuarios por página

    try {
        const users = await User.find()
            .skip((page - 1) * limit) // Saltar los primeros (page-1) * limit resultados
            .limit(parseInt(limit)); // Limitar los resultados a 'limit'

        const total = await User.countDocuments(); // Total de usuarios

        res.json({
            data: users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Actualizar campos
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }
        
        await user.save();
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
