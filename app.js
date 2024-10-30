// app.js
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const authenticateToken = require('./middlewares/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
require('dotenv').config();  // Cargar variables de entorno

const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const authController = require('./controllers/authController');

const app = express();

// Conectar a MongoDB Atlas usando mongoose
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Middleware para Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configurar CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de Morgan para logging
app.use(morgan('dev'));

// Configurar Multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });
app.use(express.static('public')); // Servir archivos estáticos

// Rutas de autenticación
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/refresh-token', authController.refreshToken);

// Ruta protegida de ejemplo
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

// Rutas CRUD para libros
app.get('/books', authenticateToken, bookController.getAllBooks);
app.get('/books/:id', authenticateToken, bookController.getBookById);
app.post('/books', authenticateToken, upload.single('imagen'), bookController.addBook);
app.put('/books/:id', authenticateToken, upload.single('imagen'), bookController.updateBook);
app.delete('/books/:id', authenticateToken, bookController.deleteBook);

// Rutas para gestión de usuarios
app.get('/users', authenticateToken, userController.getAllUsers);
app.get('/users/:id', authenticateToken, userController.getUserById);
app.put('/users/:id', authenticateToken, userController.updateUser);
app.delete('/users/:id', authenticateToken, userController.deleteUser);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
