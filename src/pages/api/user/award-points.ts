import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();
    
    const { points, reason } = req.body;
    
    if (!points || typeof points !== 'number') {
      return res.status(400).json({ message: 'Valid points value is required' });
    }
    
    // Update user points
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newPoints = user.points + points;
    const currentLevel = user.level || 1;
    
    // Check if user should level up (every 100 points)
    const newLevel = Math.floor(newPoints / 100) + 1;
    const leveledUp = newLevel > currentLevel;
    
    // Update user
    user.points = newPoints;
    if (leveledUp) {
      user.level = newLevel;
    }
    
    await user.save();
    
    // Return updated info
    res.status(200).json({ 
      points: newPoints, 
      level: user.level,
      leveledUp,
      message: `Awarded ${points} points for ${reason}`
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    res.status(500).json({ message: 'Error awarding points' });
  }
} 