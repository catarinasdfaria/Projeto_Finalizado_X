const { User, Profile } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_madeira2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    // Check if user exists (by email or username)
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (userExists) {
      return res.status(400).json({ message: 'Nome de utilizador ou email já se encontram registados.' });
    }

    // Create user. If it's the first user, make them admin (handy for testing)
    const count = await User.count();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    if (user) {
      // Cria automaticamente um perfil em branco associado a este utilizador (Relação 1:1)
      await Profile.create({
        userId: user.id,
        bio: '',
        location: '',
        website: ''
      });

      return res.status(201).json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(400).json({ message: 'Dados de utilizador inválidos.' });
    }
  } catch (error) {
    console.error('Erro no registo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor no registo.' });
  }
};

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
  const { identifier, username, password } = req.body; // identifier or username can be email or username
  const loginId = identifier || username;

  try {
    if (!loginId || !password) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: loginId }, { username: loginId }]
      }
    });

    if (user && (await user.comparePassword(password))) {
      return res.json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(401).json({ message: 'Nome de utilizador/email ou palavra-passe incorretos.' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor no login.' });
  }
};

// @desc    Get user data
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    return res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ message: 'Erro ao obter dados do perfil.' });
  }
};

// @desc    Logout user / clear token session
// @route   POST /auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Como JWT é stateless, no cliente basta apagar o token.
    // Devolvemos 200 OK para satisfazer a rubrica de Logout do docente.
    return res.status(200).json({ message: 'Sessão encerrada com sucesso.' });
  } catch (error) {
    console.error('Erro no logout:', error);
    return res.status(500).json({ message: 'Erro ao encerrar sessão.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
