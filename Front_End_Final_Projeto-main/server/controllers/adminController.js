const { User, Tweet } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users for management (Admin only)
// @route   GET /admin/users
// @access  Private/Admin
const adminGetUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt']
    });
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar utilizadores (Admin):', error);
    return res.status(500).json({ message: 'Erro ao obter utilizadores para administração.' });
  }
};

// @desc    Update a user (Admin only)
// @route   PUT /admin/users/:id
// @access  Private/Admin
const adminUpdateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Check unique constraints (if modified)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return res.status(400).json({ message: 'Este nome de utilizador já está em uso.' });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Este email já está em uso.' });
      }
      user.email = email;
    }

    if (role) {
      if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'Perfil de permissões inválido.' });
      }
      user.role = role;
    }

    await user.save();

    return res.json({
      message: 'Utilizador atualizado com sucesso.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar utilizador (Admin):', error);
    return res.status(500).json({ message: 'Erro ao atualizar utilizador.' });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /admin/users/:id
// @access  Private/Admin
const adminDeleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Prevent deleting oneself
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Não pode eliminar a sua própria conta de administrador através do painel.' });
    }

    await user.destroy();
    return res.json({ message: 'Utilizador eliminado com sucesso.' });
  } catch (error) {
    console.error('Erro ao eliminar utilizador (Admin):', error);
    return res.status(500).json({ message: 'Erro ao eliminar utilizador.' });
  }
};

// @desc    Update a tweet (Admin only)
// @route   PUT /admin/tweets/:id
// @access  Private/Admin
const adminUpdateTweet = async (req, res) => {
  const tweetId = req.params.id;
  const { message, removeImage } = req.body;

  try {
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet não encontrado.' });
    }

    if (message) {
      if (message.length > 280) {
        return res.status(400).json({ message: 'O tweet não pode exceder os 280 caracteres.' });
      }
      tweet.message = message;
    }

    if (removeImage === true) {
      tweet.img = null;
    }

    await tweet.save();

    return res.json({
      message: 'Tweet atualizado com sucesso.',
      tweet: {
        id: tweet.id,
        message: tweet.message,
        img: tweet.img
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar tweet (Admin):', error);
    return res.status(500).json({ message: 'Erro ao atualizar tweet.' });
  }
};

// @desc    Delete a tweet (Admin only)
// @route   DELETE /admin/tweets/:id
// @access  Private/Admin
const adminDeleteTweet = async (req, res) => {
  const tweetId = req.params.id;

  try {
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet não encontrado.' });
    }

    await tweet.destroy();
    return res.json({ message: 'Tweet eliminado com sucesso.' });
  } catch (error) {
    console.error('Erro ao eliminar tweet (Admin):', error);
    return res.status(500).json({ message: 'Erro ao eliminar tweet.' });
  }
};

module.exports = {
  adminGetUsers,
  adminUpdateUser,
  adminDeleteUser,
  adminUpdateTweet,
  adminDeleteTweet
};
