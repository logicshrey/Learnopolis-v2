import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

interface UserProgress {
  completed: boolean;
  quizScores: number[];
}

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

    const user = await User.findById(session.user.id)
      .populate('achievements')
      .populate('progress.courseId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate stats
    const enrolledCourses = user.progress?.length || 0;
    const completedCourses = user.progress?.filter((p: UserProgress) => p.completed)?.length || 0;
    
    // Calculate quizzes taken and average score
    let quizzesTaken = 0;
    let totalScore = 0;
    
    if (user.progress && Array.isArray(user.progress)) {
      user.progress.forEach((progress: UserProgress) => {
        if (progress.quizScores && progress.quizScores.length > 0) {
          quizzesTaken += progress.quizScores.length;
          totalScore += progress.quizScores.reduce((sum: number, score: number) => sum + score, 0);
        }
      });
    }
    
    const averageScore = quizzesTaken > 0 
      ? Math.round(totalScore / quizzesTaken) 
      : 0;

    const profile = {
      _id: user._id,
      name: user.name || 'User',
      email: user.email || 'No email',
      level: user.level || 1,
      points: user.points || 0,
      achievements: user.achievements || [],
      enrolledCourses,
      completedCourses,
      quizzesTaken,
      averageScore,
      joinDate: user.createdAt || new Date()
    };

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
} 