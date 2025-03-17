export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
} 