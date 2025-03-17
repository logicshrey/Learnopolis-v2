import { Course } from '@/types';
import Link from 'next/link';

interface CourseProgressProps {
  course: Course;
  userProgress: {
    completedModules: number[];
    quizScores: Record<string, number>;
  };
  currentModuleIndex: number;
}

export default function CourseProgress({
  course,
  userProgress,
  currentModuleIndex
}: CourseProgressProps) {
  const completionPercentage = 
    (userProgress.completedModules.length / course.modules.length) * 100;
  
  const averageScore = 
    Object.values(userProgress.quizScores).length > 0
      ? Object.values(userProgress.quizScores).reduce((a, b) => a + b, 0) / 
        Object.values(userProgress.quizScores).length
      : 0;
  
  const isCompleted = completionPercentage === 100;
  
  const nextModule = 
    currentModuleIndex < course.modules.length - 1
      ? course.modules[currentModuleIndex + 1]
      : null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h2>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Course Completion</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-indigo-600 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {userProgress.completedModules.length} of {course.modules.length} modules completed
        </p>
      </div>
      
      {/* Quiz Scores */}
      {Object.keys(userProgress.quizScores).length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Quiz Scores</h3>
          <div className="space-y-2">
            {Object.entries(userProgress.quizScores).map(([moduleIndex, score]) => (
              <div key={moduleIndex} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Module {parseInt(moduleIndex) + 1}
                </span>
                <span className="font-medium">{score}%</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Average Score</span>
                <span className="font-medium text-indigo-600">
                  {Math.round(averageScore)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Next Up */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {isCompleted ? 'Course Completed!' : 'Next Up'}
        </h3>
        {isCompleted ? (
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 mb-3">
              Congratulations! You've completed this course.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View Certificate
            </Link>
          </div>
        ) : nextModule ? (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{nextModule.title}</p>
            <p className="text-xs text-gray-600 mt-1">
              Continue your learning journey
            </p>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">Final Quiz</p>
            <p className="text-xs text-gray-600 mt-1">
              Complete the final module to finish the course
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 