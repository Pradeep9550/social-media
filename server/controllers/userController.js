const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .select('-password')  
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture')
      .populate('posts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    
    if (updates.password) {
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: 'Profile picture URL is required' });
    }

    const user = await User.findByIdAndUpdate(userId, { profilePicture }, { new: true })
      .select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile picture' });
  }
};


const followUser = async (req, res) => {
  try {
    const userId = req.user._id; 
    const targetUserId = req.params.id; 

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    if (targetUser.followers.includes(userId)) {
      return res.status(400).json({ message: 'You already follow this user' });
    }

    targetUser.followers.push(userId);
    user.following.push(targetUserId);

    await targetUser.save();
    await user.save();

    res.json({ message: 'User followed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to follow user' });
  }
};


const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.id;

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User to unfollow not found' });
    }

    if (!targetUser.followers.includes(userId)) {
      return res.status(400).json({ message: 'You do not follow this user' });
    }

    targetUser.followers.pull(userId);
    user.following.pull(targetUserId);

    await targetUser.save();
    await user.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unfollow user' });
  }
};


const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ]
    }).select('username profilePicture');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search users' });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  updateProfilePicture,
  followUser,
  unfollowUser,
  searchUsers
};
