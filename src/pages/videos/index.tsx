import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navigation from '@/components/Navigation';
import VideoSeries from '@/components/videos/VideoSeries';
import SEO from '@/components/SEO';

export default function VideosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [seedingVideos, setSeedingVideos] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial filter values from URL query parameters
    if (router.isReady) {
      if (router.query.difficulty) {
        setDifficulty(router.query.difficulty as string);
      }
      if (router.query.subject) {
        setSubject(router.query.subject as string);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (difficulty) queryParams.append('difficulty', difficulty);
        if (subject) queryParams.append('subject', subject);
        
        const res = await fetch(`/api/videos?${queryParams.toString()}`);
        const data = await res.json();
        
        if (res.ok) {
          setVideos(data.videos || []);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchVideos();
  }, [difficulty, subject]);

  const subjects = [
    'Web Development',
    'Data Science',
    'AI',
    'Computer Science',
    'Robotics',
    'Blockchain',
    'Cloud Computing',
    'Game Development',
    'Mobile Development',
    'Cybersecurity'
  ];

  const difficulties = [
    'beginner',
    'intermediate',
    'advanced'
  ];

  const handleFilterChange = () => {
    const queryParams = new URLSearchParams();
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (subject) queryParams.append('subject', subject);
    
    router.push(`/videos?${queryParams.toString()}`, undefined, { shallow: true });
  };

  const seedVideos = async () => {
    try {
      setSeedingVideos(true);
      const res = await fetch('/api/admin/seed-videos', {
        method: 'POST',
      });
      
      if (res.ok) {
        alert('Videos seeded successfully! Refreshing page...');
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Failed to seed videos: ${data.message}`);
      }
    } catch (error) {
      console.error('Error seeding videos:', error);
      alert('An error occurred while seeding videos');
    } finally {
      setSeedingVideos(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO 
        title="Video Lessons" 
        description="Watch educational videos on engineering topics with our in-app player"
      />
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Lessons</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Watch educational videos to enhance your learning
            </p>
          </div>
          
          {session && (
            <div className="mt-4 md:mt-0 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                <span className="font-medium">Pro Tip:</span> Complete videos to earn points!
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setTimeout(handleFilterChange, 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Difficulties</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setTimeout(handleFilterChange, 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setDifficulty('');
                  setSubject('');
                  router.push('/videos', undefined, { shallow: true });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {videos.length === 0 && (
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  No videos found in the database. Add sample videos to get started.
                </p>
                <div className="mt-4">
                  <button
                    onClick={seedVideos}
                    disabled={seedingVideos}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {seedingVideos ? 'Adding Videos...' : 'Add Sample Videos'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <VideoSeries 
          subject={router.query.subject as string} 
          difficulty={router.query.difficulty as string}
          videoId={router.query.videoId as string}
        />
      </main>
    </div>
  );
} 