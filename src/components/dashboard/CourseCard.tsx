import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.difficulty}
          </span>
          <span className="text-gray-500">{course.modules.length} modules</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {course.subjects.map((subject, index) => (
            <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {subject}
            </span>
          ))}
        </div>
        <Link
          href={`/courses/${course.id}`}
          className="block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Start Learning
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; 