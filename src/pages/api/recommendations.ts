import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import { RecommendationSystem } from '@/lib/ai/recommendationSystem';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();

    const user = await User.findById(session.user.id)
      .populate('progress.courseId');
    
    const allCourses = await Course.find({
      _id: { $nin: user.progress.map((p: any) => p.courseId._id) }
    });

    const recommendationSystem = new RecommendationSystem();
    const recommendations = await recommendationSystem.getRecommendations(user, allCourses);

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
} 