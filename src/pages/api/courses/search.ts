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

    const {
      query = '',
      difficulty,
      subject,
      sort = 'popular',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter
    const filter: any = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    if (difficulty) filter.difficulty = difficulty;
    if (subject) filter.subjects = subject;

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { enrollmentCount: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
    }

    // Execute query
    const skip = (Number(page) - 1) * Number(limit);
    const courses = await Course.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      courses,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ message: 'Error searching courses' });
  }
} 