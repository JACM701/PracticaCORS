// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    role: {
        type: String,
        enum: ['uploader', 'approver'], // Cambiamos los roles disponibles
        default: 'uploader',           // Por defecto será "uploader"
    },
}, { timestamps: true });


// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para verificar la contraseña
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
