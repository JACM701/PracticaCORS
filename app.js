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
const app = express();
const bookController = require('./controllers/bookController');
const authController = require('./controllers/authController');

const mongoose = require('mongoose');

// Conectar a MongoDB Atlas usando mongoose
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));


// Middleware para Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configurar CORS para permitir solo el dominio especificado desde el archivo .env
const corsOptions = {
    origin: process.env.CORS_ORIGIN, // Usar la variable de entorno CORS_ORIGIN
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Habilitar CORS usando las opciones configuradas
app.use(cors(corsOptions));

// Middleware de body-parser para procesar JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de Morgan para logging
app.use(morgan('dev'));

// Configurar Multer para guardar imágenes en la carpeta 'public/uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads');
        cb(null, uploadPath); // Ruta para guardar las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName); // Genera un nombre único para la imagen
    }
});

// Definir el middleware para manejar la subida de archivos
const upload = multer({ storage: storage });

// Servir archivos estáticos desde la carpeta 'public' para acceder a las imágenes
app.use(express.static('public'));

// Rutas de autenticación
app.post('/register', authController.register);
app.post('/login', authController.login);

// Asegúrate de agregar el middleware de autenticación a las rutas que requieran autenticación
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

// Nueva ruta para obtener los libros de un usuario autenticado
router.get('/mybooks', authenticateToken, bookController.getBooksByOwner);

// Rutas CRUD - agregar autenticación
app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getBookById);
app.post('/books', authenticateToken, upload.single('imagen'), bookController.addBook);
app.put('/books/:id', authenticateToken, upload.single('imagen'), bookController.updateBook);
app.delete('/books/:id', authenticateToken, bookController.deleteBook);

// Rutas para gestión de usuarios
app.get('/users', authenticateToken, userController.getAllUsers);          // Obtener todos los usuarios
app.get('/users/:id', authenticateToken, userController.getUserById);      // Obtener usuario por ID
app.put('/users/:id', authenticateToken, userController.updateUser);       // Actualizar usuario por ID
app.delete('/users/:id', authenticateToken, userController.deleteUser);    // Eliminar usuario por ID

// Puerto del servidor usando variable de entorno
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
