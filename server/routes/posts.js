const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const {
  createPost,
  getFeedPosts,
  getUserPosts,
  getPost,
  likePost,
  commentPost,
  deletePost,
} = require('../controllers/postController.js');

router.post('/', auth, createPost);
router.get('/feed', auth, getFeedPosts);
router.get('/user/:userId', auth, getUserPosts);
router.get('/:id', auth, getPost);
router.put('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentPost);
router.delete('/:id', auth, deletePost);



module.exports = router;
