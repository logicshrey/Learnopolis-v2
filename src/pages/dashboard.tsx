import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Course } from '@/types';
import RecommendedCourses from '@/components/dashboard/RecommendedCourses';
import LearningPathCard from '@/components/dashboard/LearningPathCard';
import RecentVideos from '@/components/dashboard/RecentVideos';

interface CourseProgress {
  courseId: {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    modules: any[];
  };
  completedModules: number[];
  quizScores: Record<string, number>;
  completed: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedingCourses, setSeedingCourses] = useState(false);
  const [coursesCount, setCoursesCount] = useState(0);
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (session?.user) {
      fetchUserProgress();
      fetchCoursesCount();
      fetchRecommendations();
    }
  }, [session, status, router]);

  const fetchUserProgress = async () => {
    try {
      const res = await fetch('/api/courses/progress');
      const data = await res.json();
      setUserProgress(data.progress || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setUserProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesCount = async () => {
    try {
      const res = await fetch('/api/courses/count');
      const data = await res.json();
      setCoursesCount(data.count);
    } catch (error) {
      console.error('Error fetching courses count:', error);
      setCoursesCount(0);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const res = await fetch('/api/ai/recommendations');
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const seedDatabase = async () => {
    try {
      setSeedingCourses(true);
      const response = await fetch('/api/admin/seed-courses', {
        method: 'POST',
      });
      
      if (response.ok) {
        await fetchCoursesCount();
        alert('Sample courses added successfully! Go to the courses page to see them.');
      } else {
        alert('Failed to add sample courses.');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('An error occurred while adding sample courses.');
    } finally {
      setSeedingCourses(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
        {coursesCount === 0 && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No courses found in the database. Add sample courses to get started.
                </p>
                <div className="mt-4">
                  <button
                    onClick={seedDatabase}
                    disabled={seedingCourses}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {seedingCourses ? 'Adding Courses...' : 'Add Sample Courses'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {session.user?.name || 'User'}!
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Level</span>
                  <span className="font-semibold">{session.user?.level || 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Points</span>
                  <span className="font-semibold">{session.user?.points || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Courses Enrolled</span>
                  <span className="font-semibold">{userProgress?.length || 0}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link
                    href="/courses"
                    className="block w-full px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                  {coursesCount === 0 && (
                    <button
                      onClick={seedDatabase}
                      disabled={seedingCourses}
                      className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      {seedingCourses ? 'Adding Courses...' : 'Add Sample Courses'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
              {userProgress && userProgress.length > 0 ? (
                <div className="space-y-6">
                  {userProgress.map((progress) => (
                    <div key={progress.courseId._id} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {progress.courseId.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {progress.courseId.description}
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>
                            {progress.completedModules?.length || 0} / {progress.courseId.modules?.length || 0} modules
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-indigo-600 rounded-full"
                            style={{ 
                              width: `${progress.courseId.modules?.length ? 
                                (progress.completedModules?.length / progress.courseId.modules.length) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {progress.courseId.difficulty.charAt(0).toUpperCase() + progress.courseId.difficulty.slice(1)}
                        </span>
                        <Link
                          href={`/courses/${progress.courseId._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No courses enrolled yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <RecommendedCourses />
        </div>

        <div className="mt-8">
          <LearningPathCard />
        </div>

        <div className="mt-8">
          <RecentVideos />
        </div>
      </main>
    </div>
  );
} 