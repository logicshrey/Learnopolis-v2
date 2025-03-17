import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

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

    // Calculate user stats
    const totalPoints = user.points;
    const coursesCompleted = user.progress.filter(p => p.completed).length;
    const currentStreak = user.streak;

    // Calculate average quiz score
    const allScores = user.progress.flatMap(p => 
      Object.values(p.quizScores)
    );
    const averageScore = allScores.length > 0
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : 0;

    // Calculate level progress
    const pointsForNextLevel = Math.pow((user.level + 1) * 100, 1.5);
    const nextLevelProgress = Math.min(
      (user.points / pointsForNextLevel) * 100,
      100
    );

    // Get course progress
    const courseProgress = await Promise.all(
      user.progress.map(async (p) => {
        const course = await Course.findById(p.courseId);
        return {
          title: course.title,
          progress: (p.completedModules.length / course.modules.length) * 100,
          completed: p.completed
        };
      })
    );

    res.status(200).json({
      totalPoints,
      coursesCompleted,
      currentStreak,
      averageScore,
      level: user.level,
      nextLevelProgress,
      achievements: user.achievements,
      courseProgress
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
} 