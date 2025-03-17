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

    const courses = await Course.find()
      .sort({ enrolledCount: -1 })
      .limit(6);

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
} 