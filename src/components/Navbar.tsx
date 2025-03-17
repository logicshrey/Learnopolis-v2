import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">EduGame</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/courses" className="text-gray-700 hover:text-primary-600">
              Courses
            </Link>
            <Link href="/leaderboard" className="text-gray-700 hover:text-primary-600">
              Leaderboard
            </Link>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 