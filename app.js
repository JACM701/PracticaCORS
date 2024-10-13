const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  // Importar cors
const authenticateToken = require('./middlewares/authMiddleware'); // Importa el middleware

const app = express();
const bookController = require('./controllers/bookController');
const authController = require('./controllers/authController');

// Configurar CORS para permitir solo el dominio especificado
const corsOptions = {
    origin: 'https://api-bookswap.onrender.com',
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

// Rutas CRUD
app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getBookById); // Buscar un libro por ID
app.post('/books', upload.single('imagen'), bookController.addBook); // Añadir middleware para subir imágenes
app.put('/books/:id', upload.single('imagen'), bookController.updateBook); // Actualizar libro con imagen
app.delete('/books/:id', bookController.deleteBook);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
