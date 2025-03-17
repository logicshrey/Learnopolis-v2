import React, { useState } from 'react';
import { Module } from '@/types';
import QuizInterface from '../quiz/QuizInterface';

interface CourseModuleProps {
  module: Module;
  onComplete: (moduleId: string | number) => void;
}

const CourseModule: React.FC<CourseModuleProps> = ({ module, onComplete }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleQuizComplete = (score: number) => {
    if (score >= 70) {
      setIsCompleted(true);
      onComplete(module.id.toString());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">{module.title}</h3>
      
      {!showQuiz ? (
        <>
          <div className="prose max-w-none mb-6" 
               dangerouslySetInnerHTML={{ __html: module.content }} />
          
          <div className="flex justify-between items-center">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              onClick={() => setShowQuiz(true)}
            >
              Take Quiz
            </button>
            
            {module.challenges.length > 0 && (
              <button
                className="text-indigo-600 hover:text-indigo-700"
              >
                View Challenges ({module.challenges.length})
              </button>
            )}
          </div>
        </>
      ) : (
        <QuizInterface
          quiz={module.quizzes[0]}
          onComplete={handleQuizComplete}
        />
      )}

      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          Module completed! You've earned {module.points} points.
        </div>
      )}
    </div>
  );
};

export default CourseModule; 