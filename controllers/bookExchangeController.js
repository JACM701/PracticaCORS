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
exports.getAllExchanges = async (req, res) => {
    try {
      // Obtener todos los intercambios sin filtrar por usuario
      const exchanges = await BookExchange.find()
        .populate('libroOfrecido')   // Resuelve el libro ofrecido
        .populate('libroDeseado')    // Resuelve el libro deseado
        .populate('usuarioSolicitante')  // Resuelve el usuario solicitante
        .populate('usuarioReceptor')     // Resuelve el usuario receptor
        .exec();
  
      // Si no hay intercambios, responder con un mensaje
      if (exchanges.length === 0) {
        return res.status(404).json({ message: 'No se encontraron intercambios de libros.' });
      }
  
      // Responder con todos los intercambios encontrados
      res.json({
        data: exchanges, 
        totalExchanges: exchanges.length
      });
  
    } catch (error) {
      console.error('Error al obtener los intercambios:', error);
      res.status(500).json({ message: 'Error al obtener los intercambios de libros.' });
    }
  };


