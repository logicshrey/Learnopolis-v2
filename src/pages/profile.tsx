import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navigation from '@/components/Navigation';
import AchievementsList from '@/components/achievements/AchievementsList';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  level: number;
  points: number;
  achievements: any[];
  enrolledCourses: number;
  completedCourses: number;
  quizzesTaken: number;
  averageScore: number;
  joinDate: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  if (!profile) {
    return (
      <div>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Error loading profile</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-2 text-gray-600">
            View your progress and achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-3xl font-bold mx-auto">
                  {profile?.name ? profile.name.charAt(0) : '?'}
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
                <p className="text-gray-600">{profile?.email || 'No email'}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Level {profile?.level || 1}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Points</span>
                  <span className="font-medium">{profile?.points || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Enrolled Courses</span>
                  <span className="font-medium">{profile?.enrolledCourses || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Completed Courses</span>
                  <span className="font-medium">{profile?.completedCourses || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quizzes Taken</span>
                  <span className="font-medium">{profile?.quizzesTaken || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-medium">{profile?.averageScore || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Joined</span>
                  <span className="font-medium">
                    {profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Achievements
                </span>
              </h2>
              
              <AchievementsList achievements={profile?.achievements || []} />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Progress Stats
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Learning Streak</h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-2xl font-bold">
                      {Math.floor(Math.random() * 10) + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-600">days in a row</p>
                      <p className="text-sm text-gray-500">Keep it up!</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Next Level</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Level {profile?.level || 1}</span>
                      <span>Level {(profile?.level || 1) + 1}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${profile?.points ? (profile.points % 100) / 100 * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile?.points ? 100 - (profile.points % 100) : 100} more points to level up
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Time Spent Learning</h3>
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {Math.floor((profile?.enrolledCourses || 0) * 3.5)} hrs
                  </div>
                  <p className="text-sm text-gray-600">
                    Across all courses
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Favorite Subject</h3>
                  <div className="text-xl font-medium text-indigo-600 mb-1">
                    {['Web Development', 'Data Science', 'AI', 'Computer Science'][Math.floor(Math.random() * 4)]}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on your course enrollments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 