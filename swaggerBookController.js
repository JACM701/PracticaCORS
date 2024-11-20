// swaggerBookController.js
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obtener todos los libros
 *     description: Obtiene todos los libros con paginación.
 *     responses:
 *       200:
 *         description: Lista de libros.
 */
exports.getAllBooksSwagger = {
    summary: "Obtener todos los libros",
    description: "Obtiene todos los libros con paginación.",
    responses: {
        200: {
            description: "Lista de libros",
        },
    },
};

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Obtener un libro por ID
 *     description: Obtiene un libro específico por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro encontrado.
 *       404:
 *         description: Libro no encontrado.
 */
exports.getBookByIdSwagger = {
    summary: "Obtener un libro por ID",
    description: "Obtiene un libro específico por su ID.",
    parameters: [
        {
            name: "id",
            in: "path",
            description: "ID del libro",
            required: true,
            schema: {
                type: "string",
            },
        },
    ],
    responses: {
        200: {
            description: "Libro encontrado",
        },
        404: {
            description: "Libro no encontrado",
        },
    },
};
