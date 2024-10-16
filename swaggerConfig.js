const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "BookSwap API",
            version: "1.0.0",
            description: "API para el intercambio de libros",
        },
        servers: [
            {
                url: "https://api-bookswap.onrender.com", // URL de tu API en Render
            },
        ],
        components: {
            schemas: {
                Libro: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "ID del libro",
                            example: 1,
                        },
                        titulo: {
                            type: "string",
                            description: "Título del libro",
                            example: "El principito",
                        },
                        autor: {
                            type: "string",
                            description: "Autor del libro",
                            example: "Antoine de Saint-Exupéry",
                        },
                        descripcion: {
                            type: "string",
                            description: "Descripción del libro",
                            example: "Una historia corta pero conmovedora.",
                        },
                        fecha_publicacion: {
                            type: "string",
                            description: "Fecha de publicación del libro",
                            example: "1943-04-06",
                        },
                        genero: {
                            type: "string",
                            description: "Género literario",
                            example: "Fantasía",
                        },
                        imagen: {
                            type: "string",
                            description: "URL de la imagen del libro",
                            example: "/uploads/el-principito.jpg",
                        },
                    },
                    required: ["titulo", "autor", "descripcion", "fecha_publicacion", "genero"],
                },
            },
        },
        paths: {
            "/books": {
                get: {
                    summary: "Obtener todos los libros",
                    responses: {
                        200: {
                            description: "Lista de libros",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Libro",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: "Añadir un nuevo libro",
                    requestBody: {
                        content: {
                            "multipart/form-data": {
                                schema: {
                                    $ref: "#/components/schemas/Libro",
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Libro añadido",
                        },
                    },
                },
            },
            "/books/{id}": {
                get: {
                    summary: "Obtener un libro por ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del libro",
                            schema: {
                                type: "integer",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Detalles del libro",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/Libro",
                                    },
                                },
                            },
                        },
                    },
                },
                put: {
                    summary: "Actualizar un libro por ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del libro",
                            schema: {
                                type: "integer",
                            },
                        },
                    ],
                    requestBody: {
                        content: {
                            "multipart/form-data": {
                                schema: {
                                    $ref: "#/components/schemas/Libro",
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Libro actualizado",
                        },
                    },
                },
                delete: {
                    summary: "Eliminar un libro por ID",
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            description: "ID del libro",
                            schema: {
                                type: "integer",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Libro eliminado",
                        },
                    },
                },
            },
        },
    },
    apis: ["./routes/*.js"], // Asegúrate de que el archivo donde definiste las rutas esté incluido
};

module.exports = swaggerOptions;
