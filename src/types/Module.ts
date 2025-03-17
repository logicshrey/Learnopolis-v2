import { Quiz as QuizType } from './Quiz';

export interface Challenge {
  id: string | number;
  title: string;
  // ... other challenge properties
}

export interface Module {
  id: string | number;
  title: string;
  content: string;
  points: number;
  quizzes: QuizType[];
  challenges: Challenge[];
}

export interface Quiz {
  id: string | number;
  title: string;
  questions: any[];
  timeLimit: number;
} 