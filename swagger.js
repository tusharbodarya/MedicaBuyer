const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'MedicaBuyer API',
            version: '1.0.0',
            description: 'API documentation for MedicaBuyer',
            contact: {
                name: 'Tushar Bodarya',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000', // Your server URL
            },
        ],
    },
    apis: ['./routes/api/*.js', './models/*.js'], // Paths to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
