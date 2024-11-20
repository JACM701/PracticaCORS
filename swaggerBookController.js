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

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Agregar un nuevo libro
 *     description: Agrega un libro nuevo a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_publicacion:
 *                 type: string
 *               genero:
 *                 type: string
 *               edicion:
 *                 type: string
 *               ano_publicado:
 *                 type: integer
 *               tipo_pasta:
 *                 type: string
 *               editorial:
 *                 type: string
 *               incluye_accesorios:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Libro creado.
 *       400:
 *         description: Solicitud incorrecta.
 */
exports.addBookSwagger = {
    summary: "Agregar un nuevo libro",
    description: "Agrega un libro nuevo a la base de datos.",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        titulo: { type: "string" },
                        autor: { type: "string" },
                        descripcion: { type: "string" },
                        fecha_publicacion: { type: "string" },
                        genero: { type: "string" },
                        edicion: { type: "string" },
                        ano_publicado: { type: "integer" },
                        tipo_pasta: { type: "string" },
                        editorial: { type: "string" },
                        incluye_accesorios: { type: "boolean" },
                    },
                },
            },
        },
    },
    responses: {
        201: {
            description: "Libro creado",
        },
        400: {
            description: "Solicitud incorrecta",
        },
    },
};

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Actualizar un libro
 *     description: Actualiza la información de un libro existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_publicacion:
 *                 type: string
 *               genero:
 *                 type: string
 *               edicion:
 *                 type: string
 *               ano_publicado:
 *                 type: integer
 *               tipo_pasta:
 *                 type: string
 *               editorial:
 *                 type: string
 *               incluye_accesorios:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Libro actualizado.
 *       404:
 *         description: Libro no encontrado.
 */
exports.updateBookSwagger = {
    summary: "Actualizar un libro",
    description: "Actualiza la información de un libro existente.",
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
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        titulo: { type: "string" },
                        autor: { type: "string" },
                        descripcion: { type: "string" },
                        fecha_publicacion: { type: "string" },
                        genero: { type: "string" },
                        edicion: { type: "string" },
                        ano_publicado: { type: "integer" },
                        tipo_pasta: { type: "string" },
                        editorial: { type: "string" },
                        incluye_accesorios: { type: "boolean" },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Libro actualizado",
        },
        404: {
            description: "Libro no encontrado",
        },
    },
};

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Eliminar un libro
 *     description: Elimina un libro por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Libro eliminado.
 *       404:
 *         description: Libro no encontrado.
 */
exports.deleteBookSwagger = {
    summary: "Eliminar un libro",
    description: "Elimina un libro por su ID.",
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
            description: "Libro eliminado",
        },
        404: {
            description: "Libro no encontrado",
        },
    },
};
