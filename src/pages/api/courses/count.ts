import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import Course from '@/models/Course';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const count = await Course.countDocuments();
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error counting courses:', error);
    res.status(500).json({ message: 'Error counting courses' });
  }
} 