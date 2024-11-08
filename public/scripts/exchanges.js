document.getElementById('exchangeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const exchangeData = {
        libroOfrecido: document.getElementById('offeredBook').value,
        libroDeseado: document.getElementById('desiredBook').value,
    };

    const response = await fetch(`${apiUrl}/exchanges`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(exchangeData),
    });

    if (response.ok) {
        alert('Intercambio solicitado con éxito');
    } else {
        alert('Error al solicitar intercambio');
    }
});
