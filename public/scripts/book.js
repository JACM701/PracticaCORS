async function getBooks() {
    const response = await fetch(`${apiUrl}/books`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const books = await response.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = books.map(book => `<p>${book.title} - ${book.author}</p>`).join('');
}
