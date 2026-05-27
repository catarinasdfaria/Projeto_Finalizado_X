const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o CORS para permitir pedidos do frontend (normalmente em localhost:5173)
app.use(cors({
  origin: '*', // em produção, especificar o domínio do cliente
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar a pasta uploads se não existir para evitar erros
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir imagens carregadas estaticamente
app.use('/uploads', express.static(uploadsDir));

// Importar Rotas
const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Importar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Registar Rotas
app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Rota de Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota raiz de status
app.get('/', (req, res) => {
  res.json({ message: 'API do Twitter da Madeira ativa e a funcionar!' });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro global no servidor:', err.message);
  res.status(500).json({ 
    message: err.message || 'Ocorreu um erro interno no servidor.' 
  });
});

// Ligar à Base de Dados MySQL e Iniciar o Servidor
const startServer = async () => {
  try {
    // Autenticar ligação
    await sequelize.authenticate();
    console.log('Conexão ao MySQL estabelecida com sucesso via Sequelize.');

    // Sincronizar modelos (cria as tabelas caso não existam)
    // Usamos force: false para não apagar dados existentes ao reiniciar
    await sequelize.sync({ force: false });
    console.log('Modelos do Sequelize sincronizados com a Base de Dados MySQL.');

    // Iniciar escuta na porta configurada
    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível ligar ao MySQL:', error);
    process.exit(1);
  }
};

startServer();
