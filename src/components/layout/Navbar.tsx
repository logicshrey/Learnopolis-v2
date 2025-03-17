import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            EduGame
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/courses" className="hover:text-indigo-200">
              Courses
            </Link>
            <Link href="/leaderboard" className="hover:text-indigo-200">
              Leaderboard
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="hover:text-indigo-200">
                  Dashboard
                </Link>
                <Link href="/profile" className="hover:text-indigo-200">
                  Profile
                </Link>
              </div>
            ) : (
              <Link href="/auth/signin" className="hover:text-indigo-200">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 