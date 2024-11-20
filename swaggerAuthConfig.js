const swaggerAuthConfig = {
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
  
  module.exports = swaggerAuthConfig;
  