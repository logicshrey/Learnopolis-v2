const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
  }],
  progress: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    completedModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    }],
    quizScores: Map,
    challengesCompleted: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    }],
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema); 