import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import { RecommendationEngine } from '@/lib/ai/recommendationEngine';

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

    // Get user with populated course data
    const user = await User.findById(session.user.id)
      .populate('progress.courseId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all available courses
    const allCourses = await Course.find();
    
    // Generate personalized recommendations
    const recommendationEngine = new RecommendationEngine();
    const recommendations = recommendationEngine.getRecommendations(user, allCourses);

    // Add explanation for each recommendation
    const recommendationsWithReasons = recommendations.map(course => {
      let reason = '';
      
      // Generate a personalized reason based on course attributes
      if (user.progress.length === 0) {
        reason = 'Popular course for beginners';
      } else {
        // Find matching subjects with user's enrolled courses
        const userSubjects = new Set();
        user.progress.forEach(progress => {
          const courseData = typeof progress.courseId === 'object' ? progress.courseId : null;
          if (courseData && courseData.subjects) {
            courseData.subjects.forEach(subject => userSubjects.add(subject));
          }
        });
        
        const matchingSubjects = course.subjects.filter(subject => userSubjects.has(subject));
        
        if (matchingSubjects.length > 0) {
          reason = `Based on your interest in ${matchingSubjects.join(', ')}`;
        } else if (course.enrollmentCount > 200) {
          reason = 'Highly rated by other students';
        } else if (course.difficulty === 'beginner' && user.level < 3) {
          reason = 'Great for your current level';
        } else if (course.difficulty === 'intermediate' && user.level >= 3 && user.level <= 5) {
          reason = 'Matches your skill level';
        } else if (course.difficulty === 'advanced' && user.level > 5) {
          reason = 'Challenge yourself with advanced content';
        } else {
          reason = 'Expand your knowledge in a new area';
        }
      }
      
      return {
        ...course,
        reason
      };
    });

    res.status(200).json({ recommendations: recommendationsWithReasons });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
} 