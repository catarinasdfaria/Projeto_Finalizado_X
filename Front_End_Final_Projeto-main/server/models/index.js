const sequelize = require('../config/database');
const User = require('./User');
const Tweet = require('./Tweet');
const Comment = require('./Comment');
const Like = require('./Like');
const Follow = require('./Follow');
const Profile = require('./Profile');

// User & Profile (1:1 relationship)
User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// User & Tweet (1:N relationship)
User.hasMany(Tweet, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Tweet.belongsTo(User, { foreignKey: 'userId', as: 'author', onDelete: 'CASCADE', onUpdate: 'CASCADE' }); // alias 'author' to get user info

// User & Comment
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Tweet & Comment
Tweet.hasMany(Comment, { foreignKey: 'tweetId', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'comments' });
Comment.belongsTo(Tweet, { foreignKey: 'tweetId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// User & Like (N:M mapping via Like)
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Tweet.hasMany(Like, { foreignKey: 'tweetId', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'likes' });
Like.belongsTo(Tweet, { foreignKey: 'tweetId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Follows association: A user can follow other users
User.hasMany(Follow, { foreignKey: 'followerId', as: 'followingRelations', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followerRelations', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  Tweet,
  Comment,
  Like,
  Follow,
  Profile
};
