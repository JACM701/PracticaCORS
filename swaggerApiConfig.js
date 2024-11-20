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
          Book: {
              type: "object",
              properties: {
                  id: { type: "integer", description: "ID del libro", example: 1 },
                  title: { type: "string", description: "Título del libro", example: "El principito" },
                  author: { type: "string", description: "Autor del libro", example: "Antoine de Saint-Exupéry" },
                  description: { type: "string", description: "Descripción del libro", example: "Una historia corta pero conmovedora." },
                  publish_date: { type: "string", description: "Fecha de publicación", example: "1943-04-06" },
                  genre: { type: "string", description: "Género literario", example: "Fantasía" },
                  image: { type: "string", description: "URL de la imagen", example: "/uploads/el-principito.jpg" },
                  edition: { type: "string", description: "Edición", example: "Primera edición" },
                  year_published: { type: "integer", description: "Año de publicación", example: 1943 },
                  cover_type: { type: "string", description: "Tipo de tapa", example: "Dura" },
                  publisher: { type: "string", description: "Editorial", example: "Gallimard" },
                  accessories_included: { type: "boolean", description: "Incluye accesorios", example: true },
              },
              required: ["title", "author", "description", "publish_date", "genre"],
          },
          User: {
              type: "object",
              properties: {
                  username: { type: "string", description: "Nombre de usuario", example: "usuario123" },
                  password: { type: "string", description: "Contraseña", example: "password123" },
                  name: { type: "string", description: "Nombre completo", example: "Juan Pérez" },
                  phone: { type: "string", description: "Número de teléfono", example: "+34 600 123 456" },
                  email: { type: "string", description: "Correo electrónico", example: "juan.perez@example.com" },
              },
              required: ["username", "password", "name", "phone", "email"],
          },
          BookExchange: {
              type: "object",
              properties: {
                  libroOfrecido: { type: "string", description: "ID del libro ofrecido", example: "60c72b2f9b1d4c3e88b44755" },
                  libroDeseado: { type: "string", description: "ID del libro deseado", example: "60c72b2f9b1d4c3e88b44756" },
                  usuarioSolicitante: { type: "string", description: "ID del usuario solicitante", example: "60c72b2f9b1d4c3e88b44757" },
                  usuarioReceptor: { type: "string", description: "ID del usuario receptor", example: "60c72b2f9b1d4c3e88b44758" },
                  fechaIntercambio: { type: "string", format: "date", description: "Fecha del intercambio", example: "2023-11-08" },
                  estado: { type: "string", description: "Estado del intercambio", enum: ["pending", "completed", "canceled"], example: "pending" },
              },
              required: ["libroOfrecido", "libroDeseado", "usuarioSolicitante", "usuarioReceptor"],
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
                      "application/json": { schema: { $ref: "#/components/schemas/User" } },
                  },
              },
              responses: {
                  201: { description: "Usuario registrado con éxito" },
                  400: { description: "Solicitud inválida (por ejemplo, falta de campos)" },
              },
          },
      },
      "/login": {
          post: {
              summary: "Iniciar sesión",
              requestBody: {
                  required: true,
                  content: {
                      "application/json": { schema: { $ref: "#/components/schemas/User" } },
                  },
              },
              responses: {
                  200: { description: "Inicio de sesión exitoso, se devuelve el token de acceso" },
                  401: { description: "Credenciales incorrectas" },
                  500: { description: "Error interno en el servidor" },
              },
          },
      },
      "/refresh-token": {
          post: {
              summary: "Refrescar el token de acceso",
              requestBody: {
                  required: true,
                  content: {
                      "application/json": { schema: { type: "object", properties: { refreshToken: { type: "string" } } } },
                  },
              },
              responses: {
                  200: { description: "Token de acceso refrescado exitosamente" },
                  403: { description: "Token de refresco no válido o expirado" },
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
                                  items: { $ref: "#/components/schemas/Book" },
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
                      "multipart/form-data": { schema: { $ref: "#/components/schemas/Book" } },
                  },
              },
              responses: {
                  201: { description: "Libro añadido con éxito" },
                  400: { description: "Solicitud inválida" },
              },
          },
      },
      "/exchanges": {
          post: {
              summary: "Crear un nuevo intercambio de libros",
              requestBody: {
                  required: true,
                  content: {
                      "application/json": { schema: { $ref: "#/components/schemas/BookExchange" } },
                  },
              },
              responses: {
                  201: { description: "Intercambio creado con éxito" },
                  400: { description: "Error al crear el intercambio" },
              },
          },
          get: {
              summary: "Obtener intercambios del usuario",
              responses: {
                  200: {
                      description: "Lista de intercambios del usuario",
                      content: {
                          "application/json": {
                              schema: {
                                  type: "array",
                                  items: { $ref: "#/components/schemas/BookExchange" },
                              },
                          },
                      },
                  },
              },
          },
      },
      "/exchanges/{id}/status": {
          put: {
              summary: "Actualizar el estado de un intercambio",
              parameters: [
                  {
                      name: "id",
                      in: "path",
                      required: true,
                      description: "ID del intercambio",
                      schema: { type: "string" },
                  },
              ],
              requestBody: {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/BookExchange",
                          },
                      },
                  },
              },
              responses: {
                  200: { description: "Estado de intercambio actualizado con éxito" },
                  400: { description: "Solicitud inválida" },
                  404: { description: "Intercambio no encontrado" },
              },
          },
      },
  },
};

module.exports = swaggerOptions;
