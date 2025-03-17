import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import Video from '@/models/Video';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { difficulty, subject, limit, videoId } = req.query;
    
    // Build query
    const query: any = {};
    if (difficulty) query.difficulty = difficulty;
    if (subject) query.subject = subject;
    if (videoId) query._id = videoId;
    
    // Get videos
    let videosQuery = Video.find(query).sort({ createdAt: -1 });
    
    // Apply limit if provided
    if (limit && !isNaN(Number(limit))) {
      videosQuery = videosQuery.limit(Number(limit));
    }
    
    const videos = await videosQuery;
    
    // Add console log for debugging
    console.log(`Found ${videos.length} videos matching query:`, query);
    
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
} 