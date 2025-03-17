import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');

  // Generate a background color based on the course difficulty
  const getBgColor = () => {
    switch (course.difficulty) {
      case 'beginner':
        return 'bg-green-100 border-green-300';
      case 'intermediate':
        return 'bg-blue-100 border-blue-300';
      case 'advanced':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const handleEnroll = async () => {
    if (!session) {
      // Redirect to sign in page if not authenticated
      router.push('/auth/signin');
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          courseId: course.id || course._id 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEnrolled(true);
      } else {
        setError(data.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('An error occurred while enrolling');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {course.subjects && course.subjects.map((subject, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
              {subject}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            course.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            course.difficulty === 'intermediate' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
            'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
          }`}>
            {course.difficulty && (course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1))}
          </span>
          
          <button
            onClick={handleEnroll}
            disabled={enrolling || enrolled}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              enrolled
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400'
            }`}
          >
            {enrolling ? 'Enrolling...' : enrolled ? 'Enrolled' : 'Enroll'}
          </button>
        </div>
      </div>
    </div>
  );
} 