import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

export default function DebugVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const res = await fetch('/api/videos');
        const data = await res.json();
        
        console.log('API response:', data);
        
        if (res.ok) {
          setVideos(data.videos || []);
        } else {
          setError(data.message || 'Failed to fetch videos');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('An error occurred while fetching videos');
      } finally {
        setLoading(false);
      }
    }
    
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Debug Videos</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading videos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md text-red-700 dark:text-red-300">
            <p>{error}</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Found {videos.length} videos</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto max-h-96 text-sm">
              {JSON.stringify(videos, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md text-yellow-700 dark:text-yellow-300">
            <p>No videos found in the database. Try running the seed script.</p>
            <div className="mt-4">
              <code className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-sm">
                npm run seed:videos
              </code>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 