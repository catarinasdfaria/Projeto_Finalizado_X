const { Tweet, User, Like, Follow, Comment } = require('../models');

// @desc    Create a new tweet
// @route   POST /tweets
// @access  Private
const createTweet = async (req, res) => {
  const { message } = req.body;

  try {
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'A mensagem do tweet não pode estar vazia.' });
    }

    if (message.length > 280) {
      return res.status(400).json({ message: 'O tweet não pode ter mais de 280 caracteres.' });
    }

    // Handle image upload path
    let img = null;
    if (req.file) {
      // Dynamic full URL
      img = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const tweet = await Tweet.create({
      message,
      img,
      userId: req.user.id
    });

    // Format output to match frontend structure
    const formattedTweet = {
      id: tweet.id,
      message: tweet.message,
      img: tweet.img,
      user: req.user.username,
      authorId: req.user.id,
      date: tweet.createdAt.toISOString(),
      likes: 0,
      follow: false, // Cannot follow oneself in a meaningful feed context usually, or set to false
      isLiked: false
    };

    return res.status(201).json(formattedTweet);
  } catch (error) {
    console.error('Erro ao criar tweet:', error);
    return res.status(500).json({ message: 'Erro ao criar tweet.' });
  }
};

// @desc    Get all tweets (Feed)
// @route   GET /tweets
// @access  Private
const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Like, as: 'likes', attributes: ['id', 'userId'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Check which users the current user follows
    const follows = await Follow.findAll({
      where: { followerId: req.user.id }
    });
    const followedUserIds = follows.map(f => f.followingId);

    // Format tweets for frontend
    const formattedTweets = tweets.map(t => {
      const isLiked = t.likes ? t.likes.some(like => like.userId === req.user.id) : false;
      const follow = followedUserIds.includes(t.userId) || t.userId === req.user.id; // follow is true if followed OR if it's the user's own tweet

      return {
        id: t.id,
        message: t.message,
        img: t.img,
        user: t.author ? t.author.username : 'anon',
        authorId: t.userId,
        date: t.createdAt.toISOString(),
        likes: t.likes ? t.likes.length : 0,
        follow: follow,
        isLiked: isLiked
      };
    });

    return res.json(formattedTweets);
  } catch (error) {
    console.error('Erro ao listar tweets:', error);
    return res.status(500).json({ message: 'Erro ao obter tweets.' });
  }
};

// @desc    Like or Unlike a tweet
// @route   POST /tweets/:id/like
// @access  Private
const likeTweet = async (req, res) => {
  const tweetId = req.params.id;

  try {
    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet não encontrado.' });
    }

    // Check if user already liked the tweet
    const existingLike = await Like.findOne({
      where: {
        userId: req.user.id,
        tweetId
      }
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      return res.json({ liked: false, message: 'Retirou gosto do tweet.' });
    } else {
      // Like
      await Like.create({
        userId: req.user.id,
        tweetId
      });
      return res.json({ liked: true, message: 'Gostou do tweet!' });
    }
  } catch (error) {
    console.error('Erro ao gostar do tweet:', error);
    return res.status(500).json({ message: 'Erro ao processar gosto.' });
  }
};

// @desc    Get comments for a tweet
// @route   GET /tweets/:id/comments
// @access  Private
const getComments = async (req, res) => {
  const tweetId = req.params.id;

  try {
    const comments = await Comment.findAll({
      where: { tweetId },
      include: [
        { model: User, as: 'author', attributes: ['username'] }
      ],
      order: [['createdAt', 'ASC']]
    });

    const formattedComments = comments.map(c => ({
      id: c.id,
      message: c.message,
      user: c.author ? c.author.username : 'anon',
      date: c.createdAt.toISOString()
    }));

    return res.json(formattedComments);
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
    return res.status(500).json({ message: 'Erro ao obter comentários.' });
  }
};

// @desc    Add a comment to a tweet
// @route   POST /tweets/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const tweetId = req.params.id;
  const { message } = req.body;

  try {
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'O comentário não pode estar vazio.' });
    }

    const tweet = await Tweet.findByPk(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet não encontrado.' });
    }

    const comment = await Comment.create({
      message,
      tweetId,
      userId: req.user.id
    });

    const formattedComment = {
      id: comment.id,
      message: comment.message,
      user: req.user.username,
      date: comment.createdAt.toISOString()
    };

    return res.status(201).json(formattedComment);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({ message: 'Erro ao adicionar comentário.' });
  }
};

module.exports = {
  createTweet,
  getTweets,
  likeTweet,
  getComments,
  addComment
};
