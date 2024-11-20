require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Book = require('./models/bookModel');
const BookExchange = require('./models/bookExchangeModel');

async function seedBookExchanges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://Jacm701:SueñitosTieneHambreTodoElTiempo@bookswap.cuqet.mongodb.net/?retryWrites=true&w=majority&appName=BookSwap');
    console.log('Conectado a MongoDB');

    const users = await User.find().limit(10); // Usa algunos usuarios para los intercambios
    const books = await Book.find().limit(2000); // Usa libros para los intercambios

    const exchanges = [];
    for (let i = 0; i < 1000; i++) {
      const libroOfrecido = books[i]._id;
      const libroDeseado = books[1999 - i]._id;
      const usuarioSolicitante = users[i % users.length]._id;

      // Selecciona un usuario receptor distinto al usuario solicitante
      let usuarioReceptor;
      do {
        usuarioReceptor = users[Math.floor(Math.random() * users.length)]._id;
      } while (usuarioReceptor.equals(usuarioSolicitante));

      exchanges.push({
        libroOfrecido,
        libroDeseado,
        usuarioSolicitante,
        usuarioReceptor
      });
    }

    await BookExchange.insertMany(exchanges);
    console.log('Intercambios de libros agregados exitosamente');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al agregar intercambios de libros:', error);
    mongoose.connection.close();
  }
}

seedBookExchanges();
