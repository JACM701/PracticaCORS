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
      "/users": {
          get: {
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
      }
  }
};

module.exports = swaggerOptions;
