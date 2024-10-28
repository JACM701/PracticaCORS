// services/authService.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secretKey = process.env.JWT_SECRET || 'SueñitosTieneHambreTodoElTiempo';

let users = []; // Nota: Cambia esto a una base de datos en producción

const generateToken = (user) => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' });
};

const createUser = async (username, password) => {
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        throw new Error('Usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    return newUser;
};

const authenticateUser = async (username, password) => {
    const user = users.find(user => user.username === username);
    if (!user) return null;

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return null;

    return generateToken({ username: user.username });
};

module.exports = { generateToken, createUser, authenticateUser };
