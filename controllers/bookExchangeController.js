// controllers/bookExchangeController.js
const bookExchangeService = require('../services/bookExchangeService');

// Crear un nuevo intercambio de libros
exports.createExchange = async (req, res) => {
    try {
        console.log('Iniciando creación de intercambio');
        const exchangeData = { ...req.body, usuarioSolicitante: req.user.id };
        console.log('Datos recibidos para el intercambio:', exchangeData);

        const newExchange = await bookExchangeService.createExchange(exchangeData);
        console.log('Intercambio creado exitosamente:', newExchange);

        res.status(201).json(newExchange);
    } catch (error) {
        console.error('Error al crear intercambio:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar el estado del intercambio
exports.updateExchangeStatus = async (req, res) => {
    try {
        console.log('Iniciando actualización de estado de intercambio');
        console.log('ID del intercambio a actualizar:', req.params.id);
        console.log('Nuevo estado:', req.body.estado);

        const updatedExchange = await bookExchangeService.updateExchangeStatus(req.params.id, req.body.estado);
        console.log('Estado del intercambio actualizado exitosamente:', updatedExchange);

        res.json(updatedExchange);
    } catch (error) {
        console.error('Error al actualizar estado de intercambio:', error.message);
        res.status(400).json({ message: error.message });
    }
};


// Obtener todos los intercambios (sin filtro por usuario)
exports.getAllExchangedBooks = async (req, res) => {
    try {
      // Obtener todos los intercambios y sus libros ofrecidos y deseados
      const exchanges = await BookExchange.find()
        .populate('libroOfrecido') // Resuelve el libro ofrecido
        .populate('libroDeseado') // Resuelve el libro deseado
        .exec();
  
      // Si no hay intercambios
      if (!exchanges || exchanges.length === 0) {
        return res.status(404).json({ message: 'No se encontraron intercambios de libros.' });
      }
  
      // Recopilamos todos los libros ofrecidos y deseados
      const exchangedBooks = exchanges.map(exchange => ({
        libroOfrecido: exchange.libroOfrecido,
        libroDeseado: exchange.libroDeseado
      }));
  
      // Retornamos los libros intercambiados
      res.json({
        data: exchangedBooks,
        totalExchanges: exchangedBooks.length
      });
  
    } catch (error) {
      console.error('Error al obtener los libros intercambiados:', error.message);
      res.status(500).json({ message: 'Error al obtener los libros intercambiados' });
    }
  };


// Obtener intercambios del usuario con paginación
exports.getUserExchanges = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const exchanges = await bookExchangeService.findExchangesByUser(req.user.id, page, limit);
        const total = await bookExchangeService.countExchangesByUser(req.user.id);

        res.json({
            data: exchanges,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalExchanges: total,
        });
    } catch (error) {
        console.error('Error al obtener los intercambios del usuario:', error.message);
        res.status(500).json({ message: 'Error al obtener los intercambios del usuario' });
    }
};

