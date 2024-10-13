const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require ('multer');
const path = require ('path');
const app = express();
const bookController = require('./controllers/bookController');

//Configurar Multer para guardar umagenes en la carpeta 'public/uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); //Nombre Unico
    }
    
});

// Definir la variable 'upload' para manejar la subida de archivos
const upload = multer({ storage: storage }); // Aquí se define 'upload'

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Middleware de Morgan para logging
app.use(morgan('dev'));

// Middleware de body-parser para procesar JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas CRUD
app.get('/books', bookController.getAllBooks);
app.get('/books/:id', bookController.getBookById); // Buscar un libro por ID
app.post('/books', upload.single('imagen'), bookController.addBook); // Añadir middleware 'upload.single' para subir imágenes
app.put('/books/:id', upload.single('imagen'), bookController.updateBook); // Añadir multer aquí
app.delete('/books/:id', bookController.deleteBook);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
