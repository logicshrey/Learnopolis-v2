import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import VideoPlayer from './VideoPlayer';
import { useToast } from '@/context/ToastContext';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  duration: number;
}

interface VideoSeriesProps {
  subject?: string;
  difficulty?: string;
  videoId?: string;
}

export default function VideoSeries({ subject, difficulty, videoId }: VideoSeriesProps) {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchVideos();
    if (session?.user) {
      fetchCompletedVideos();
    }
  }, [subject, difficulty, videoId, session]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (subject) queryParams.append('subject', subject);
      if (difficulty) queryParams.append('difficulty', difficulty);
      if (videoId) queryParams.append('videoId', videoId);
      
      const res = await fetch(`/api/videos?${queryParams.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setVideos(data.videos);
        
        // If videoId is specified, select that video
        if (videoId && data.videos.length > 0) {
          const video = data.videos.find((v: Video) => v._id === videoId);
          if (video) {
            setSelectedVideo(video);
          } else {
            setSelectedVideo(data.videos[0]);
          }
        } else if (data.videos.length > 0) {
          setSelectedVideo(data.videos[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedVideos = async () => {
    try {
      const res = await fetch('/api/videos/completed');
      const data = await res.json();
      
      if (res.ok) {
        setCompletedVideos(data.completedVideos || []);
      }
    } catch (error) {
      console.error('Error fetching completed videos:', error);
    }
  };

  const handleVideoComplete = async (videoId: string) => {
    if (!session?.user) {
      showToast('Sign in to track your progress', 'info');
      return;
    }
    
    if (completedVideos.includes(videoId)) return;
    
    try {
      const res = await fetch('/api/videos/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });
      
      if (res.ok) {
        setCompletedVideos([...completedVideos, videoId]);
        showToast('Video marked as completed!', 'success');
        
        // Award points
        const pointsRes = await fetch('/api/user/award-points', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            points: 10, 
            reason: 'Completed a video lesson' 
          }),
        });
        
        if (pointsRes.ok) {
          showToast('You earned 10 points!', 'success');
        }
      }
    } catch (error) {
      console.error('Error marking video as complete:', error);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading videos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No videos available
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {subject || difficulty 
            ? `No videos found for the selected filters.` 
            : `No videos available yet. Check back soon!`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {selectedVideo && (
          <VideoPlayer 
            videoId={selectedVideo.videoId} 
            title={selectedVideo.title}
            onComplete={() => handleVideoComplete(selectedVideo._id)}
          />
        )}
        
        {selectedVideo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedVideo.title}</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(selectedVideo.difficulty)}`}>
                {selectedVideo.difficulty.charAt(0).toUpperCase() + selectedVideo.difficulty.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedVideo.description}</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {Math.floor(selectedVideo.duration / 60)}:{(selectedVideo.duration % 60).toString().padStart(2, '0')} minutes
              </span>
              <span className="mx-2">•</span>
              <span>{selectedVideo.subject}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 h-fit">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Video Series</h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {videos.map((video) => (
            <div 
              key={video._id}
              onClick={() => setSelectedVideo(video)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedVideo?._id === video._id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{video.title}</h4>
                {completedVideos.includes(video._id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                <span className="mx-1">•</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${getDifficultyColor(video.difficulty)}`}>
                  {video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 