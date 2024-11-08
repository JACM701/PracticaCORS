const swaggerOptions = {
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
            Book: { // Cambié de "Libro" a "Book" para mantener la consistencia en inglés
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "ID del libro",
                        example: 1,
                    },
                    title: { // Cambié "titulo" a "title" para consistencia
                        type: "string",
                        description: "Título del libro",
                        example: "El principito",
                    },
                    author: {
                        type: "string",
                        description: "Autor del libro",
                        example: "Antoine de Saint-Exupéry",
                    },
                    description: {
                        type: "string",
                        description: "Descripción del libro",
                        example: "Una historia corta pero conmovedora.",
                    },
                    publish_date: {
                        type: "string",
                        description: "Fecha de publicación del libro",
                        example: "1943-04-06",
                    },
                    genre: {
                        type: "string",
                        description: "Género literario",
                        example: "Fantasía",
                    },
                    image: {
                        type: "string",
                        description: "URL de la imagen del libro",
                        example: "/uploads/el-principito.jpg",
                    },
                    edition: {
                        type: "string",
                        description: "Edición del libro",
                        example: "Primera edición",
                    },
                    year_published: {
                        type: "integer",
                        description: "Año de publicación del libro",
                        example: 1943,
                    },
                    cover_type: {
                        type: "string",
                        description: "Tipo de tapa del libro",
                        example: "Dura",
                    },
                    publisher: {
                        type: "string",
                        description: "Editorial del libro",
                        example: "Gallimard",
                    },
                    accessories_included: {
                        type: "boolean",
                        description: "Indica si el libro incluye accesorios",
                        example: true,
                    },
                },
                required: ["title", "author", "description", "publish_date", "genre"],
            },
            User: {
                type: "object",
                properties: {
                    username: {
                        type: "string",
                        description: "Nombre de usuario",
                        example: "usuario123",
                    },
                    password: {
                        type: "string",
                        description: "Contraseña",
                        example: "password123",
                    },
                    name: {
                        type: "string",
                        description: "Nombre completo del usuario",
                        example: "Juan Pérez",
                    },
                    phone: {
                        type: "string",
                        description: "Número de teléfono del usuario",
                        example: "+34 600 123 456",
                    },
                    email: {
                        type: "string",
                        description: "Correo electrónico del usuario",
                        example: "juan.perez@example.com",
                    },
                },
                required: ["username", "password", "name", "phone", "email"],
            },
        },
    },
    paths: {
        "/register": {
            post: {
                summary: "Registrar un nuevo usuario",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Usuario registrado con éxito",
                    },
                    400: {
                        description: "Solicitud inválida",
                    },
                },
            },
        },
        "/login": {
            post: {
                summary: "Iniciar sesión",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Inicio de sesión exitoso",
                    },
                    401: {
                        description: "Credenciales incorrectas",
                    },
                },
            },
        },
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
                                        $ref: "#/components/schemas/Book",
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
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/Book",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Libro añadido con éxito",
                    },
                    400: {
                        description: "Solicitud inválida",
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
                                    $ref: "#/components/schemas/Book",
                                },
                            },
                        },
                    },
                    404: {
                        description: "Libro no encontrado",
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
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                $ref: "#/components/schemas/Book",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Libro actualizado con éxito",
                    },
                    400: {
                        description: "Solicitud inválida",
                    },
                    404: {
                        description: "Libro no encontrado",
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
                        description: "Libro eliminado con éxito",
                    },
                    404: {
                        description: "Libro no encontrado",
                    },
                },
            },
        },
    },
};

module.exports = swaggerOptions;
