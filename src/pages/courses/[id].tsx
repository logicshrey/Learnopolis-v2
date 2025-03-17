import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navigation from '@/components/Navigation';
import ModuleList from '@/components/courses/ModuleList';
import ModuleContent from '@/components/courses/ModuleContent';
import CourseProgress from '@/components/courses/CourseProgress';
import StudyBuddy from '@/components/ai/StudyBuddy';
import { Course, Module } from '@/types';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProgress, setUserProgress] = useState<{
    completedModules: number[];
    quizScores: Record<string, number>;
  }>({
    completedModules: [],
    quizScores: {}
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchCourseData(id);
    }
  }, [router.query]);

  const fetchCourseData = async (courseId: string) => {
    if (!courseId || courseId === 'undefined') {
      setError('Invalid course ID');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch course');
      }
      
      const data = await res.json();
      setCourse(data.course);
      
      // Fetch user progress if logged in
      if (session?.user) {
        fetchUserProgress(courseId);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/progress`);
      
      if (!res.ok) {
        return; // New enrollment or not enrolled
      }
      
      const data = await res.json();
      setUserProgress(data.progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleModuleComplete = async (moduleId: number, score: number) => {
    if (!session || !session.user?.id) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch(`/api/courses/${id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          score
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }

      const data = await res.json();
      
      // Update local state
      setUserProgress(data.progress);
      
      // Show completion message
      alert(`Module completed! You scored ${score}%`);
      
      // Move to next module if available
      if (currentModuleIndex < (course?.modules.length || 0) - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
            <p className="text-gray-600 mb-8">{error || 'This course does not exist or has been removed.'}</p>
            <button
              onClick={() => router.push('/courses')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-gray-600">{course.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Module List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Modules</h2>
              <ModuleList
                modules={course.modules}
                currentModuleIndex={currentModuleIndex}
                setCurrentModule={setCurrentModuleIndex}
                completedModules={userProgress.completedModules}
              />
            </div>
          </div>
          
          {/* Module Content */}
          <div className="lg:col-span-2">
            {course.modules[currentModuleIndex] && (
              <ModuleContent
                module={course.modules[currentModuleIndex]}
                onComplete={handleModuleComplete}
                isCompleted={userProgress.completedModules.includes(currentModuleIndex)}
                quizScore={userProgress.quizScores[currentModuleIndex]}
              />
            )}
            <div className="mt-8">
              <StudyBuddy 
                courseTitle={course.title} 
                moduleTitle={course.modules[currentModuleIndex].title} 
              />
            </div>
          </div>
          
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <CourseProgress
              course={course}
              userProgress={userProgress}
              currentModuleIndex={currentModuleIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 