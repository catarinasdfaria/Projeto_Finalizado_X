const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'twitter_madeira',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // desativar logs de SQL no terminal para ficar mais limpo
    define: {
      timestamps: true, // gera automaticamente createdAt e updatedAt
    }
  }
);

module.exports = sequelize;
