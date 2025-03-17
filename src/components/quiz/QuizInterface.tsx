import React, { useState, useEffect } from 'react';
import { Quiz } from '@/types/Quiz';

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleQuizComplete();
    }
  }, [timeLeft, isComplete]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex.toString();
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setIsComplete(true);
    const score = calculateScore();
    onComplete(score);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quiz.questions.length) * 100;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {!isComplete ? (
        <>
          <div className="flex justify-between mb-6">
            <span className="text-lg font-semibold">
              Question {currentQuestion + 1}/{quiz.questions.length}
            </span>
            <span className="text-red-600">Time left: {timeLeft}s</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl mb-4">{quiz.questions[currentQuestion].question}</h3>
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full p-3 text-left rounded-lg border ${
                    selectedAnswers[currentQuestion] === index.toString()
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
          <p className="text-xl">Your score: {calculateScore()}%</p>
        </div>
      )}
    </div>
  );
};

export default QuizInterface; 