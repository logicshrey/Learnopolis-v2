const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  subjects: [{
    type: String,
  }],
  modules: [{
    title: String,
    content: String,
    quizzes: [{
      questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
      }],
      timeLimit: Number,
      points: Number,
    }],
    challenges: [{
      title: String,
      description: String,
      type: {
        type: String,
        enum: ['coding', 'problem-solving', 'project'],
      },
      points: Number,
      deadline: Date,
    }],
    points: Number,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema); 