import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Use getServerSession instead of getSession for API routes
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id)
      .populate('progress.courseId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      progress: user.progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
} 