const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: String,
  mediaUrl: { type: String, required: true },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  audio: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reel', reelSchema);
