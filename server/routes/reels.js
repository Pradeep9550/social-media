const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  getReels,
  likePost,
  commentPost
} = require('../controllers/postController');


router.get('/', auth, getReels);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentPost);

module.exports = router;
