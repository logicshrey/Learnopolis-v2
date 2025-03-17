import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Video {
  _id: string;
  title: string;
  videoId: string;
  difficulty: string;
  subject: string;
  duration: number;
}

export default function RecentVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentVideos();
  }, []);

  const fetchRecentVideos = async () => {
    try {
      console.log('Fetching recent videos...');
      const res = await fetch('/api/videos?limit=3');
      const data = await res.json();
      
      console.log('Response from videos API:', data);
      
      if (res.ok) {
        setVideos(data.videos);
      } else {
        console.error('Error response from videos API:', data);
      }
    } catch (error) {
      console.error('Error fetching recent videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'advanced':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Recent Videos
        </span>
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading videos...</p>
        </div>
      ) : videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video._id} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden relative">
                <img 
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-600 bg-opacity-80 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{video.title}</h3>
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatDuration(video.duration)}</span>
                  <span className="mx-1">•</span>
                  <span>{video.subject}</span>
                  <span className="mx-1">•</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${getDifficultyColor(video.difficulty)}`}>
                    {video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                  </span>
                </div>
              </div>
              
              <Link
                href={`/videos?videoId=${video._id}`}
                className="ml-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Watch
              </Link>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <Link
              href="/videos"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              View all videos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No videos available yet
          </p>
          <Link
            href="/videos"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Videos
          </Link>
        </div>
      )}
    </div>
  );
} 