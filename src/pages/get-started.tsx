import Link from 'next/link';

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold">
              EduGame
            </Link>
            <div className="flex gap-6">
              <Link href="/courses" className="hover:text-indigo-200">
                Courses
              </Link>
              <Link href="/leaderboard" className="hover:text-indigo-200">
                Leaderboard
              </Link>
              <Link 
                href="/get-started"
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Get Started Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Get Started with EduGame</h1>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Create Your Account</h2>
                <p className="text-gray-600 mb-4">
                  Join our community of learners and start tracking your progress.
                </p>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                  Sign Up Now
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Choose Your Path</h2>
                <p className="text-gray-600 mb-4">
                  Select from our wide range of engineering courses and start learning.
                </p>
                <Link 
                  href="/courses"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Browse Courses →
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Start Learning</h2>
                <p className="text-gray-600 mb-4">
                  Complete challenges, earn points, and climb the leaderboard.
                </p>
                <Link 
                  href="/leaderboard"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View Leaderboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 