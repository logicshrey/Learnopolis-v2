import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface RecommendedCourse extends Course {
  reason: string;
}

export default function RecommendedCourses() {
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/ai/recommendations');
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Recommended For You
        </span>
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">AI is finding the perfect courses for you...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((course) => (
            <div key={course.id || course._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {course.subjects && course.subjects.map((subject, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
              <div className="text-sm text-indigo-600 mb-3 italic">
                {course.reason}
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.difficulty === 'beginner' ? 'bg-green-200 text-green-800' :
                  course.difficulty === 'intermediate' ? 'bg-blue-200 text-blue-800' :
                  'bg-purple-200 text-purple-800'
                }`}>
                  {course.difficulty && (course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1))}
                </span>
                <Link
                  href={`/courses/${course.id || course._id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Course →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Complete more courses to get personalized recommendations
          </p>
        </div>
      )}
    </div>
  );
} 