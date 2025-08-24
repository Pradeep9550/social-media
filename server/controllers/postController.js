const Post = require('../models/Post');
const User = require('../models/User');


const createPost = async (req, res) => {
  try {
    const { caption, mediaType, mediaUrl } = req.body;
    const userId = req.user._id;

    if (!mediaType || !mediaUrl) {
      return res.status(400).json({ message: 'mediaType and mediaUrl are required' });
    }

    const post = await Post.create({
      user: userId,
      caption,
      mediaType,
      mediaUrl,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { posts: post._id }
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Error in createPost:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};



const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user posts' });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: liked ? 'Unliked' : 'Liked' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to like/unlike post' });
  }
};

const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: userId, text });
    await post.save();

    const updatedPost = await Post.findById(post._id).populate('comments.user', 'username');

    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to comment on post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await User.findByIdAndUpdate(post.user, {
      $pull: { posts: post._id }
    });

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

const getReels = async (req, res) => {
  try {
    const reels = await Post.find({ mediaType: 'video' })
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 })

    res.json(reels)
  } catch (err) {
    console.error('Error fetching reels:', err)
    res.status(500).json({ message: 'Failed to fetch reels' })
  }
}



module.exports = {
  createPost,
  getFeedPosts,
  getUserPosts,
  getPost,
  likePost,
  commentPost,
  deletePost,
  getReels, 
};
