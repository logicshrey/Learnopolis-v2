import mongoose from 'mongoose';

const UserVideoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only have one record per video
UserVideoSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.models.UserVideo || mongoose.model('UserVideo', UserVideoSchema); 