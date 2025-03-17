import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  completedModules: [{
    type: Number
  }],
  quizScores: {
    type: Map,
    of: Number
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  unlockedAt: Date
});

const dailyChallengeProgressSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyChallenge'
  },
  completed: Boolean,
  completedAt: Date
});

const certificateSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  issuedAt: Date,
  certificateUrl: String
});

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  image: String,
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  progress: [userProgressSchema],
  achievements: [achievementSchema],
  dailyChallenges: [dailyChallengeProgressSchema],
  certificates: [certificateSchema]
});

export default mongoose.models.User || mongoose.model('User', userSchema); 