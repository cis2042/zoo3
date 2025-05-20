const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZOO3 API 文檔',
      version: '1.0.0',
      description: 'ZOO3 平台 API 文檔',
      contact: {
        name: 'ZOO3 開發團隊',
        url: 'https://zoo3.app',
        email: 'support@zoo3.app'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: '開發環境'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/index.js'], // 指定 API 路由文件的位置
};

const specs = swaggerJsdoc(options);

module.exports = specs;
