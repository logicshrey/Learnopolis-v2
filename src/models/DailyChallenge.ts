import mongoose from 'mongoose';

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  requirements: {
    type: {
      type: String,
      enum: ['modules_completed', 'quiz_score', 'points_earned'],
      required: true
    },
    count: Number
  },
  reward: {
    points: Number,
    streak: Number
  }
});

export default mongoose.models.DailyChallenge || mongoose.model('DailyChallenge', dailyChallengeSchema); 