const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_madeira2026');

      // Get user from the token and attach to request
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Utilizador não encontrado. Acesso não autorizado.' });
      }

      next();
    } catch (error) {
      console.error('Erro na verificação de token:', error);
      return res.status(401).json({ message: 'Sessão inválida ou expirada. Acesso não autorizado.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Sem token de autenticação. Acesso não autorizado.' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem aceder a este recurso.' });
  }
};

module.exports = {
  protect,
  admin
};
