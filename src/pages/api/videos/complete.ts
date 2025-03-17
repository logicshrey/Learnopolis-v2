import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import UserVideo from '@/models/UserVideo';

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
    
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }
    
    // Check if already completed
    const existingRecord = await UserVideo.findOne({
      userId: session.user.id,
      videoId
    });
    
    if (existingRecord) {
      return res.status(200).json({ message: 'Video already marked as completed' });
    }
    
    // Mark as completed
    await UserVideo.create({
      userId: session.user.id,
      videoId,
      completed: true
    });
    
    res.status(200).json({ message: 'Video marked as completed' });
  } catch (error) {
    console.error('Error marking video as complete:', error);
    res.status(500).json({ message: 'Error marking video as complete' });
  }
} 