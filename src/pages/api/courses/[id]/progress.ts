import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import mongoose from 'mongoose';

interface CourseProgress {
  courseId: string;
  completed: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user's progress for this course
    const courseProgress = user.progress.find(
      (p: CourseProgress) => p.courseId && p.courseId.toString() === id
    );

    if (!courseProgress) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    if (req.method === 'GET') {
      // Return the user's progress
      return res.status(200).json({
        progress: {
          completedModules: courseProgress.completedModules || [],
          quizScores: courseProgress.quizScores || {}
        }
      });
    } else if (req.method === 'POST') {
      // Update the user's progress
      const { moduleId, score } = req.body;
      
      if (moduleId === undefined || score === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Initialize arrays/objects if they don't exist
      if (!courseProgress.completedModules) {
        courseProgress.completedModules = [];
      }
      
      if (!courseProgress.quizScores) {
        courseProgress.quizScores = {};
      }

      // Add the module to completed modules if not already there
      if (!courseProgress.completedModules.includes(moduleId)) {
        courseProgress.completedModules.push(moduleId);
      }

      // Update the quiz score
      courseProgress.quizScores[moduleId] = score;

      // Check if all modules are completed
      const course = await Course.findById(id);
      if (course && courseProgress.completedModules.length === course.modules.length) {
        courseProgress.completed = true;
        
        // Award points for course completion
        user.points += 500;
        
        // Check for level up
        const newLevel = Math.floor(user.points / 1000) + 1;
        if (newLevel > user.level) {
          user.level = newLevel;
        }
      }

      await user.save();

      return res.status(200).json({
        message: 'Progress updated successfully',
        progress: {
          completedModules: courseProgress.completedModules,
          quizScores: courseProgress.quizScores
        }
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling progress:', error);
    res.status(500).json({ message: 'Error handling progress' });
  }
} 