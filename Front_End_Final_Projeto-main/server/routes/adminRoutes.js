const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  adminGetUsers,
  adminUpdateUser, 
  adminDeleteUser, 
  adminUpdateTweet, 
  adminDeleteTweet 
} = require('../controllers/adminController');

router.get('/users', protect, admin, adminGetUsers);
router.put('/users/:id', protect, admin, adminUpdateUser);
router.delete('/users/:id', protect, admin, adminDeleteUser);

router.put('/tweets/:id', protect, admin, adminUpdateTweet);
router.delete('/tweets/:id', protect, admin, adminDeleteTweet);

module.exports = router;
