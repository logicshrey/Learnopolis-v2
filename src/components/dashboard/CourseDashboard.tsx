import React from 'react';
import { Course } from '@/types';
import CourseCard from './CourseCard';
import ProgressChart from './ProgressChart';

interface CourseDashboardProps {
  courses: Course[];
  userProgress: any;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ courses, userProgress }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <ProgressChart progress={userProgress} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          {/* Achievement list component */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseDashboard; 