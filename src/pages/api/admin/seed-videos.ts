import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import Video from '@/models/Video';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Optional: Check if user is admin
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    await connectDB();
    
    // Clear existing videos
    await Video.deleteMany({});
    
    // Define sample videos inline
    const sampleVideos = [
      // Web Development - Beginner
      {
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the basics of HTML and CSS to build your first web page. This video covers the essential elements, attributes, and styling properties you need to know.',
        videoId: 'qz0aGYrrlhU', // Sample YouTube ID
        difficulty: 'beginner',
        subject: 'Web Development',
        duration: 1520 // 25:20 in seconds
      },
      {
        title: 'JavaScript Basics for Beginners',
        description: 'Start your journey with JavaScript by learning variables, data types, functions, and basic DOM manipulation.',
        videoId: 'W6NZfCO5SIk', // Sample YouTube ID
        difficulty: 'beginner',
        subject: 'Web Development',
        duration: 2880 // 48:00 in seconds
      },
      // Web Development - Intermediate
      {
        title: 'Building Responsive Websites with Flexbox and Grid',
        description: 'Take your CSS skills to the next level by mastering modern layout techniques with Flexbox and CSS Grid.',
        videoId: 'JJSoEo8JSnc', // Sample YouTube ID
        difficulty: 'intermediate',
        subject: 'Web Development',
        duration: 3600 // 60:00 in seconds
      },
      {
        title: 'React.js Crash Course',
        description: 'Learn the fundamentals of React.js including components, props, state, and hooks to build interactive user interfaces.',
        videoId: 'w7ejDZ8SWv8', // Sample YouTube ID
        difficulty: 'intermediate',
        subject: 'Web Development',
        duration: 5400 // 90:00 in seconds
      }
    ];
    
    // Insert sample videos
    const result = await Video.insertMany(sampleVideos);
    
    res.status(200).json({ 
      message: `Successfully seeded ${result.length} videos`,
      count: result.length
    });
  } catch (error) {
    console.error('Error seeding videos:', error);
    res.status(500).json({ message: 'Error seeding videos' });
  }
} 