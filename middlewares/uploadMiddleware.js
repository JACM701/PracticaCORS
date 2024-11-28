// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
        cb(null, uploadPath); // Directorio donde se guardarán los archivos subidos
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname); // Crear nombre único
        cb(null, uniqueName); // Establecer el nombre final del archivo
    }
});

// Filtrar los tipos de archivos permitidos (por ejemplo, solo imágenes)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos de archivo permitidos
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Archivo válido
    } else {
        cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF)'), false); // Archivo no permitido
    }
};

// Crear el middleware de multer
const upload = multer({ storage, fileFilter });

// Exportar el middleware para su uso
module.exports = upload;
