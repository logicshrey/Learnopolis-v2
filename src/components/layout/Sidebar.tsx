import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white w-64 min-h-screen p-4 shadow-lg">
      <nav className="space-y-4">
        <Link href="/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Dashboard
        </Link>
        <Link href="/courses" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Courses
        </Link>
        <Link href="/achievements" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Achievements
        </Link>
        <Link href="/profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 