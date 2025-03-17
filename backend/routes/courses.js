const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new course (admin only)
router.post('/', auth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    difficulty: req.body.difficulty,
    subjects: req.body.subjects,
    modules: req.body.modules,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update course progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { moduleId, quizScore, challengeId } = req.body;
    const user = req.user;

    // Update user progress
    const courseProgress = user.progress.find(
      (p) => p.courseId.toString() === req.params.id
    );

    if (moduleId) {
      courseProgress.completedModules.push(moduleId);
    }

    if (quizScore) {
      courseProgress.quizScores.set(quizScore.quizId, quizScore.score);
    }

    if (challengeId) {
      courseProgress.challengesCompleted.push(challengeId);
    }

    await user.save();
    res.json(user.progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 