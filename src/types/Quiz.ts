export interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string | number;
  title: string;
  description?: string;
  questions: Question[];
  moduleId?: string | number;
} 