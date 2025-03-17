import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import { LearningPathGenerator } from '@/lib/ai/learningPathGenerator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all available courses
    const allCourses = await Course.find();
    
    // Generate learning paths
    const pathGenerator = new LearningPathGenerator();
    const learningPaths = pathGenerator.generateLearningPaths(user, allCourses);

    res.status(200).json({ learningPaths });
  } catch (error) {
    console.error('Error generating learning paths:', error);
    res.status(500).json({ message: 'Error generating learning paths' });
  }
} 