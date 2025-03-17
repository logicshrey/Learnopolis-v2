import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import mongoose from 'mongoose';
import { UserProgress } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Use getServerSession instead of getSession for API routes
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  try {
    await connectDB();

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingEnrollment = user.progress.find((p: UserProgress) => 
      p.courseId && p.courseId.toString() === courseId
    );

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Enroll user in course
    user.progress.push({
      courseId: new mongoose.Types.ObjectId(courseId),
      completedModules: [],
      quizScores: {},
      completed: false
    });

    await user.save();

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(200).json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
} 