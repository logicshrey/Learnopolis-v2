import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-400">Learnopolis</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              The AI-powered learning platform for engineering excellence
            </p>
            <div className="mt-10 flex justify-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 md:text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative dots pattern */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          <div className="h-full w-48 bg-gradient-to-l from-indigo-600 to-transparent" />
          <div className="grid grid-cols-3 gap-2 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white" />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience a new way of learning engineering
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* AI-Powered Learning */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-indigo-600 text-white">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">AI-Powered Learning</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Personalized learning paths and recommendations adapted to your progress and learning style.
                </p>
              </div>

              {/* Interactive Challenges */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-indigo-600 text-white">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Interactive Challenges</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Learn by doing with hands-on projects, coding challenges, and real-world problems.
                </p>
              </div>

              {/* Progress Tracking */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-indigo-600 text-white">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">Progress Tracking</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Monitor your growth with detailed analytics and achievement badges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-indigo-600">50+</div>
              <div className="mt-2 text-lg font-medium text-gray-600">Engineering Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-indigo-600">1000+</div>
              <div className="mt-2 text-lg font-medium text-gray-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-indigo-600">200+</div>
              <div className="mt-2 text-lg font-medium text-gray-600">Interactive Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-indigo-600">95%</div>
              <div className="mt-2 text-lg font-medium text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to start learning?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-indigo-100">
                  Join thousands of students already learning on our platform.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="flex space-x-4">
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Browse Courses
                  </Link>
                  {!session && (
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500"
                    >
                      Sign Up Free
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Learn with Video Lessons
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Watch expert-led video tutorials for all skill levels, from beginner to advanced.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Beginner Card */}
              <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                      <svg className="h-6 w-6 text-green-600 dark:text-green-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Beginner Videos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Perfect for those just starting out</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a 
                      href="/videos?difficulty=beginner" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Watch Now
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Intermediate Card */}
              <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Intermediate Videos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">For those ready to level up their skills</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a 
                      href="/videos?difficulty=intermediate" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Watch Now
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Advanced Card */}
              <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Videos</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Expert content for seasoned professionals</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a 
                      href="/videos?difficulty=advanced" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Watch Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}