const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API do Twitter da Madeira',
    description: 'API RESTful completa para o clone do Twitter/X da Madeira, utilizando Express, Sequelize e MySQL. Desenvolvida para avaliação conjunta.',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Insira o seu token JWT com o prefixo Bearer (exemplo: Bearer <token_jwt>)'
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = './swagger.json';
// O swagger-autogen começa a fazer o varrimento a partir do ficheiro app.js
const endpointsFiles = ['./app.js'];

console.log('A gerar documentação Swagger...');
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Ficheiro swagger.json gerado com sucesso!');
  process.exit(0);
}).catch(err => {
  console.error('Erro ao gerar o swagger.json:', err);
  process.exit(1);
});
