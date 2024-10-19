import { Express } from 'express';
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

class Swagger {
    static options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Element API',
                version: '1.0.0',
            },
        },
        apis: ['./src/routes/*.ts'],
    };

    static setup(app: Express) {
        const openapiSpecification = swaggerJsdoc(this.options);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
    }
}

export default Swagger;