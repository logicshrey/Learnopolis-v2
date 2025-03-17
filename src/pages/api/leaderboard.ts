import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { UserProgress } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const timeframe = req.query.timeframe as string || 'all';
    
    // Build query based on timeframe
    let query = {};
    
    if (timeframe === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      query = { updatedAt: { $gte: oneWeekAgo } };
    } else if (timeframe === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      query = { updatedAt: { $gte: oneMonthAgo } };
    }
    
    // Get users sorted by points
    const users = await User.find(query)
      .select('name email level points progress')
      .sort({ points: -1, level: -1 })
      .limit(50);
    
    // Format user data for leaderboard
    const formattedUsers = users.map(user => {
      // Count completed courses
      const completedCourses = user.progress.filter((p: UserProgress) => p.completed).length;
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        points: user.points,
        coursesCompleted: completedCourses
      };
    });

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
} 