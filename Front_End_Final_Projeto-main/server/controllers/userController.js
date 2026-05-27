const { User, Follow } = require('../models');

// @desc    Get all users
// @route   GET /users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role']
    });
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar utilizadores:', error);
    return res.status(500).json({ message: 'Erro ao obter utilizadores.' });
  }
};

// @desc    Follow or Unfollow a user
// @route   POST /users/:id/follow
// @access  Private
const followUser = async (req, res) => {
  const targetUserId = req.params.id;

  try {
    if (parseInt(targetUserId) === req.user.id) {
      return res.status(400).json({ message: 'Não pode seguir a si próprio.' });
    }

    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Check if relationship already exists
    const existingFollow = await Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: targetUserId
      }
    });

    if (existingFollow) {
      // Unfollow
      await existingFollow.destroy();
      return res.json({ followed: false, message: `Deixou de seguir @${targetUser.username}.` });
    } else {
      // Follow
      await Follow.create({
        followerId: req.user.id,
        followingId: targetUserId
      });
      return res.json({ followed: true, message: `Passou a seguir @${targetUser.username}!` });
    }
  } catch (error) {
    console.error('Erro ao seguir utilizador:', error);
    return res.status(500).json({ message: 'Erro ao processar seguimento.' });
  }
};

module.exports = {
  getUsers,
  followUser
};
