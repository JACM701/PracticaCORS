const swaggerOptions = {
    openapi: "3.0.0",
    info: {
        title: "BookSwap API",
        version: "1.0.0",
        description: "API para gestionar usuarios, libros e intercambios de libros",
    },
    servers: [
        {
            url: "https://api-bookswap.onrender.com",
            description: "Servidor de producción"
        },
        {
            url: "http://localhost:3000",
            description: "Servidor local para desarrollo"
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "string", description: "ID único del usuario", example: "60c72b2f9b1d4c3e88b44757" },
                    username: { type: "string", description: "Nombre de usuario", example: "usuario123" },
                    email: { type: "string", description: "Correo electrónico", example: "usuario@example.com" },
                    password: { type: "string", description: "Contraseña", example: "password123" },
                    role: { type: "string", description: "Rol del usuario", enum: ["user", "admin"], example: "user" }
                },
                required: ["username", "email", "password"]
            },
            Book: {
                type: "object",
                properties: {
                    id: { type: "string", description: "ID único del libro", example: "60c72b2f9b1d4c3e88b44755" },
                    title: { type: "string", description: "Título del libro", example: "El principito" },
                    author: { type: "string", description: "Autor del libro", example: "Antoine de Saint-Exupéry" },
                    description: { type: "string", description: "Descripción del libro", example: "Historia conmovedora" },
                    publish_date: { type: "string", format: "date", description: "Fecha de publicación", example: "1943-04-06" },
                    genre: { type: "string", description: "Género literario", example: "Fantasía" },
                    image: { type: "string", description: "URL de la imagen", example: "/uploads/el-principito.jpg" },
                    edition: { type: "string", description: "Edición", example: "Primera edición" },
                    year_published: { type: "integer", description: "Año de publicación", example: 1943 },
                    cover_type: { type: "string", description: "Tipo de tapa", example: "Dura" },
                    publisher: { type: "string", description: "Editorial", example: "Gallimard" }
                },
                required: ["title", "author", "description", "publish_date", "genre"]
            },
            BookExchange: {
                type: "object",
                properties: {
                    id: { type: "string", description: "ID único del intercambio", example: "60d72c2e9b1d4c3e88b44765" },
                    offeredBookId: { type: "string", description: "ID del libro ofrecido", example: "60c72b2f9b1d4c3e88b44755" },
                    desiredBookId: { type: "string", description: "ID del libro deseado", example: "60c72b2f9b1d4c3e88b44756" },
                    requesterId: { type: "string", description: "ID del usuario que solicita el intercambio", example: "60c72b2f9b1d4c3e88b44757" },
                    receiverId: { type: "string", description: "ID del usuario que recibe el intercambio", example: "60c72b2f9b1d4c3e88b44758" },
                    status: {
                        type: "string",
                        description: "Estado del intercambio",
                        enum: ["pending", "completed", "canceled"],
                        example: "pending"
                    },
                    exchangeDate: { type: "string", format: "date", description: "Fecha del intercambio", example: "2024-01-15" }
                },
                required: ["offeredBookId", "desiredBookId", "requesterId", "receiverId"]
            }
        }
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
    paths: {
        // Usuarios
        "/register": {
            post: {
                tags:["Registro y login"],
                summary: "Registrar un nuevo usuario",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/User" } },
                    },
                },
                responses: {
                    201: { description: "Usuario registrado con éxito" },
                    400: { description: "Solicitud inválida" },
                },
            },
        },
        "/login": {
            post: {
                tags:["Registro y login"],
                summary: "Iniciar sesión",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/User" } },
                    },
                },
                responses: {
                    200: { description: "Inicio de sesión exitoso" },
                    401: { description: "Credenciales incorrectas" },
                },
            },
        },
        "/users": {
            get: {
                tags:["Users"],
                summary: "Obtener todos los usuarios",
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: "Lista de usuarios",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/User" }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags:["Users"],
                summary: "Registrar un nuevo usuario",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/User" } }
                    }
                },
                responses: {
                    201: { description: "Usuario registrado con éxito" },
                    400: { description: "Solicitud inválida" }
                }
            }
        },
        "/users/{id}": {
            get: {
                tags:["Users"],
                summary: "Obtener un usuario por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del usuario",
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: {
                        description: "Detalles del usuario",
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/User" } }
                        }
                    },
                    404: { description: "Usuario no encontrado" }
                }
            },
            put: {
                tags:["Users"],
                summary: "Actualizar un usuario por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del usuario",
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/User" } }
                    }
                },
                responses: {
                    200: { description: "Usuario actualizado con éxito" },
                    400: { description: "Solicitud inválida" },
                    404: { description: "Usuario no encontrado" }
                }
            },
            delete: {
                tags:["Users"],
                summary: "Eliminar un usuario por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del usuario",
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: { description: "Usuario eliminado con éxito" },
                    404: { description: "Usuario no encontrado" }
                }
            }
        },
        // Libros
        "/books": {
            get: {
                tags:["Books"],
                summary: "Obtener todos los libros",
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: "Lista de libros",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Book" }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags:["Books"],
                summary: "Añadir un nuevo libro",
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/Book" } }
                    }
                },
                responses: {
                    201: { description: "Libro añadido con éxito" },
                    400: { description: "Solicitud inválida" }
                }
            }
        },
        "/books/{id}": {
            get: {
                tags:["Books"],
                summary: "Obtener un libro por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del libro",
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: {
                        description: "Detalles del libro",
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/Book" } }
                        }
                    },
                    404: { description: "Libro no encontrado" }
                }
            },
            put: {
                tags:["Books"],
                summary: "Actualizar un libro por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del libro",
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/Book" } }
                    }
                },
                responses: {
                    200: { description: "Libro actualizado con éxito" },
                    400: { description: "Solicitud inválida" },
                    404: { description: "Libro no encontrado" }
                }
            },
            delete: {
                tags:["Books"],
                summary: "Eliminar un libro por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del libro",
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: { description: "Libro eliminado con éxito" },
                    404: { description: "Libro no encontrado" }
                }
            }
        },
        // Intercambios
        "/api/exchange": {
            get: {
                tags:["Intercambios"],
                summary: "Obtener todos los intercambios",
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: "Lista de intercambios",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/BookExchange" }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                tags:["Intercambios"],
                summary: "Crear un nuevo intercambio",
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/BookExchange" } }
                    }
                },
                responses: {
                    201: { description: "Intercambio creado con éxito" },
                    400: { description: "Solicitud inválida" }
                }
            }
        },
        "/api/exchange/{id}": {
            get: {
                tags:["Intercambios"],
                summary: "Obtener un intercambio por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del intercambio",
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: {
                        description: "Detalles del intercambio",
                        content: {
                            "application/json": { schema: { $ref: "#/components/schemas/BookExchange" } }
                        }
                    },
                    404: { description: "Intercambio no encontrado" }
                }
            },
            put: {
                tags:["Intercambios"],
                summary: "Actualizar un intercambio por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del intercambio",
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": { schema: { $ref: "#/components/schemas/BookExchange" } }
                    }
                },
                responses: {
                    200: { description: "Intercambio actualizado con éxito" },
                    400: { description: "Solicitud inválida" },
                    404: { description: "Intercambio no encontrado" }
                }
            },
            delete: {
                tags:["Intercambios"],
                summary: "Eliminar un intercambio por ID",
                security: [{ BearerAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del intercambio",
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    200: { description: "Intercambio eliminado con éxito" },
                    404: { description: "Intercambio no encontrado" }
                }
            }
        }
    }
};

module.exports = swaggerOptions;
