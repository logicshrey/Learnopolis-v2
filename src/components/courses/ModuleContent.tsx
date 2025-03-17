import { useState } from 'react';
import { Module } from '@/types';
import Quiz from '@/components/quiz/Quiz';

interface ModuleContentProps {
  module: Module;
  onComplete: (moduleIndex: number, score: number) => void;
  isCompleted: boolean;
  quizScore?: number;
}

export default function ModuleContent({ 
  module, 
  onComplete, 
  isCompleted,
  quizScore
}: ModuleContentProps) {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizComplete = (score: number) => {
    onComplete(module.id, score);
    setShowQuiz(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {isCompleted && (
        <div className="mb-4 flex items-center text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Module completed</span>
          {quizScore !== undefined && (
            <span className="ml-2">• Score: {quizScore}%</span>
          )}
        </div>
      )}

      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: module.content }}
      />

      {!showQuiz && !isCompleted && (
        <div className="mt-8">
          <button
            onClick={() => setShowQuiz(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Take Quiz
          </button>
        </div>
      )}

      {showQuiz && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Module Quiz</h3>
          <Quiz 
            questions={module.quiz} 
            onComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  );
} 