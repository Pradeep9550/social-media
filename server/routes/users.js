const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateProfile, 
  updateProfilePicture, 
  followUser, 
  unfollowUser, 
  searchUsers 
} = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');


router.get('/profile/:username', getUserProfile);
router.put('/profile', auth, updateProfile);
router.put('/profile/picture', auth, updateProfilePicture);
router.put('/follow/:id', auth, followUser);
router.put('/unfollow/:id', auth, unfollowUser);
router.get('/search', searchUsers);

module.exports = router;