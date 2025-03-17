import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Course } from '@/types';

interface LearningPath {
  title: string;
  description: string;
  courses: Course[];
  estimatedTimeToComplete: string;
  skillsGained: string[];
}

export default function LearningPaths() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (session?.user) {
      fetchLearningPaths();
    }
  }, [session, status, router]);

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

  const enrollInLearningPath = async (courses: Course[], pathIndex: number) => {
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    setEnrolling(pathIndex);
    
    try {
      // Enroll in each course sequentially
      for (const course of courses) {
        const courseId = course.id || course._id;
        
        // Check if already enrolled
        const checkRes = await fetch(`/api/courses/${courseId}/progress`);
        if (checkRes.ok) {
          // Already enrolled, skip
          continue;
        }
        
        // Enroll in course
        const res = await fetch('/api/courses/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId
          }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to enroll in course');
        }
      }
      
      // Show success message
      alert(`Successfully enrolled in the ${paths[pathIndex].title} learning path!`);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error enrolling in learning path:', error);
      alert('Failed to enroll in learning path. Please try again.');
    } finally {
      setEnrolling(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating AI learning paths...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Generated Learning Paths</h1>
          <p className="mt-2 text-gray-600">
            Personalized learning journeys designed to help you achieve your goals
          </p>
        </div>
        
        {paths.length > 0 ? (
          <div className="space-y-12">
            {paths.map((path, pathIndex) => (
              <div key={pathIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">{path.title}</h2>
                  <p className="mt-2 text-gray-600">{path.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {path.estimatedTimeToComplete}
                    </div>
                    {path.skillsGained.map((skill, skillIndex) => (
                      <div key={skillIndex} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recommended Course Sequence</h3>
                  <div className="space-y-6">
                    {path.courses.map((course, courseIndex) => (
                      <div key={course.id || course._id} className="flex">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                          {courseIndex + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-lg font-medium">{course.title}</h4>
                          <p className="text-gray-600 line-clamp-2">{course.description}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.difficulty === 'beginner' ? 'bg-green-200 text-green-800' :
                              course.difficulty === 'intermediate' ? 'bg-blue-200 text-blue-800' :
                              'bg-purple-200 text-purple-800'
                            }`}>
                              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                            </span>
                            <Link
                              href={`/courses/${course.id || course._id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              View Course →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => enrollInLearningPath(path.courses, pathIndex)}
                    disabled={enrolling === pathIndex}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  >
                    {enrolling === pathIndex ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enrolling...
                      </span>
                    ) : (
                      'Enroll in This Learning Path'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No learning paths available
            </h3>
            <p className="text-gray-600 mb-6">
              Complete more courses to unlock personalized learning paths
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 