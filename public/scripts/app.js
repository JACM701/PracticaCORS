const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const registerMessage = document.getElementById('registerMessage');
const loginMessage = document.getElementById('loginMessage');
const tokenDisplay = document.getElementById('tokenDisplay');
const adminContainer = document.getElementById('adminContainer');
const bookContainer = document.getElementById('bookContainer');
const exchangedBooksContainer = document.getElementById('exchangedBooksContainer');
const usersContainer = document.getElementById('usersContainer');

let token = ''; // Guardará el token del usuario logueado

// Registro de usuario
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch('https://api-bookswap.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (response.ok) {
      registerMessage.style.color = 'green';
      registerMessage.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
    } else {
      registerMessage.style.color = 'red';
      registerMessage.textContent = `Error: ${result.message}`;
    }
  } catch (error) {
    registerMessage.style.color = 'red';
    registerMessage.textContent = `Error de conexión: ${error.message}`;
  }
});

// Inicio de sesión
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('https://api-bookswap.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
      token = result.accessToken; // Guardar el token
      loginMessage.style.color = 'green';
      loginMessage.textContent = 'Inicio de sesión exitoso.';
      tokenDisplay.textContent = `Token: ${token}`;
      tokenDisplay.classList.remove('hidden');
      adminContainer.classList.remove('hidden'); // Mostrar la administración
    } else {
      loginMessage.style.color = 'red';
      loginMessage.textContent = `Error: ${result.message}`;
    }
  } catch (error) {
    loginMessage.style.color = 'red';
    loginMessage.textContent = `Error de conexión: ${error.message}`;
  }
});

// Obtener libros
async function fetchBooks() {
  try {
    const response = await fetch('https://api-bookswap.onrender.com/books', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const books = await response.json();
    if (response.ok) {
      bookContainer.innerHTML = '';
      books.forEach((book) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
          <h3>${book.titulo}</h3>
          <p>${book.descripcion}</p>
          <button onclick="deleteBook('${book._id}')">Eliminar</button>
        `;
        bookContainer.appendChild(bookCard);
      });
    } else {
      bookContainer.innerHTML = 'Error al cargar libros.';
    }
  } catch (error) {
    bookContainer.innerHTML = `Error de conexión: ${error.message}`;
  }
}

// Eliminar libro
async function deleteBook(bookId) {
  try {
    const response = await fetch(`https://api-bookswap.onrender.com/books/${bookId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert('Libro eliminado con éxito.');
      fetchBooks();
    } else {
      alert('Error al eliminar el libro.');
    }
  } catch (error) {
    alert(`Error de conexión: ${error.message}`);
  }
}

// Obtener libros intercambiados
async function fetchExchangedBooks() {
  try {
    const response = await fetch('https://api-bookswap.onrender.com/exchanged-books', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const exchangedBooks = await response.json();
    if (response.ok) {
      exchangedBooksContainer.innerHTML = '';
      exchangedBooks.forEach((exchangedBook) => {
        const exchangedBookCard = document.createElement('div');
        exchangedBookCard.className = 'book-card';
        exchangedBookCard.innerHTML = `
          <h3>Libro: ${exchangedBook.bookId.titulo}</h3>
          <p>Usuario: ${exchangedBook.userId.username}</p>
          <p>Intercambiado el: ${new Date(exchangedBook.exchangedAt).toLocaleDateString()}</p>
        `;
        exchangedBooksContainer.appendChild(exchangedBookCard);
      });
    } else {
      exchangedBooksContainer.innerHTML = 'Error al cargar libros intercambiados.';
    }
  } catch (error) {
    exchangedBooksContainer.innerHTML = `Error de conexión: ${error.message}`;
  }
}

// Obtener usuarios
async function fetchUsers() {
  try {
    const response = await fetch('https://api-bookswap.onrender.com/users', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await response.json();
    if (response.ok) {
      usersContainer.innerHTML = '';
      users.forEach((user) => {
        const userCard = document.createElement('div');
        userCard.className = 'book-card';
        userCard.innerHTML = `
          <h3>Usuario: ${user.username}</h3>
          <p>Email: ${user.email}</p>
        `;
        usersContainer.appendChild(userCard);
      });
    } else {
      usersContainer.innerHTML = 'Error al cargar usuarios.';
    }
  } catch (error) {
    usersContainer.innerHTML = `Error de conexión: ${error.message}`;
  }
}
