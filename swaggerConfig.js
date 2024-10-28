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
                    edicion: {
                        type: "string",
                        description: "Edición del libro",
                        example: "Primera edición",
                    },
                    ano_publicacion: {
                        type: "integer",
                        description: "Año de publicación del libro",
                        example: 1943,
                    },
                    tipo_tapa: {
                        type: "string",
                        description: "Tipo de tapa del libro",
                        example: "Dura",
                    },
                    editorial: {
                        type: "string",
                        description: "Editorial del libro",
                        example: "Gallimard",
                    },
                    accesorios_incluidos: {
                        type: "boolean",
                        description: "Indica si el libro incluye accesorios",
                        example: true,
                    },
                },
                required: ["titulo", "autor", "descripcion", "fecha_publicacion", "genero"],
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
                    nombre: {
                        type: "string",
                        description: "Nombre completo del usuario",
                        example: "Juan Pérez",
                    },
                    telefono: {
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
                required: ["username", "password", "nombre", "telefono", "email"],
            },
        },
    },
    paths: {
        "/register": {
            post: {
                summary: "Registrar un nuevo usuario",
                requestBody: {
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
                },
            },
        },
        "/login": {
            post: {
                summary: "Iniciar sesión",
                requestBody: {
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
                        description: "Libro añadido con éxito",
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
                        description: "Libro actualizado con éxito",
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
                },
            },
        },
    },
};

module.exports = swaggerOptions;
