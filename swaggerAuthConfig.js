const swaggerAuthConfig = {
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'JWT Bearer token',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
  
  module.exports = swaggerAuthConfig;
  