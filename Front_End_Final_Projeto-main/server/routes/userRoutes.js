const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUsers, followUser } = require('../controllers/userController');

router.get('/', protect, getUsers);
router.post('/:id/follow', protect, followUser);

module.exports = router;
