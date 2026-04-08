import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'E-Commerce API Documentation',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'https://e-commerce-a6cz.onrender.com/',
        description: 'Production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/Modules/**/*.controller.js', './src/Modules/**/*.validation.js'],
};

export default swaggerJsdoc(options);
