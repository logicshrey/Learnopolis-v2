import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import UserVideo from '@/models/UserVideo';

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
    
    const userVideos = await UserVideo.find({ 
      userId: session.user.id,
      completed: true
    });
    
    const completedVideos = userVideos.map(uv => uv.videoId.toString());
    
    res.status(200).json({ completedVideos });
  } catch (error) {
    console.error('Error fetching completed videos:', error);
    res.status(500).json({ message: 'Error fetching completed videos' });
  }
} 