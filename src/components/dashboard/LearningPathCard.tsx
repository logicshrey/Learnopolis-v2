import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface LearningPath {
  title: string;
  description: string;
  courses: Course[];
  estimatedTimeToComplete: string;
  skillsGained: string[];
}

export default function LearningPathCard() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const res = await fetch('/api/ai/learning-paths');
      const data = await res.json();
      setPaths(data.learningPaths || []);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Learning Paths
        </span>
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating learning paths...</p>
        </div>
      ) : paths.length > 0 ? (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{paths[0].title}</h3>
            <p className="text-gray-600 mt-1">{paths[0].description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {paths[0].estimatedTimeToComplete}
              </div>
              {paths[0].skillsGained.slice(0, 3).map((skill, index) => (
                <div key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {skill}
                </div>
              ))}
              {paths[0].skillsGained.length > 3 && (
                <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  +{paths[0].skillsGained.length - 3} more
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">First steps:</h4>
            <div className="space-y-2">
              {paths[0].courses.slice(0, 2).map((course, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-900">{course.title}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {paths.length} learning path{paths.length > 1 ? 's' : ''} available
            </span>
            <Link
              href="/learning-paths"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all paths
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Complete more courses to unlock personalized learning paths
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
} 