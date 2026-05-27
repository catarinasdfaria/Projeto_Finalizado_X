const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tweet = sequelize.define('Tweet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  message: {
    type: DataTypes.STRING(280),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 280]
    }
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Tweet;
