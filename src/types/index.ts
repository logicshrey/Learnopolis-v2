import { Quiz, QuizQuestion } from './Quiz';

export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  level: number;
  points: number;
  streak: number;
  progress: UserProgress[];
  achievements: Achievement[];
}

export interface Course {
  _id: string;
  id?: string;
  title: string;
  description: string;
  subjects: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  enrollmentCount: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  content: string;
  quizzes: Quiz[];
  quiz?: Quiz;
}

export interface UserProgress {
  courseId: Course | string;
  completed: boolean;
  quizScores: number[] | Record<string, number>;
  completedModules: string[] | number[];
}

export interface Progress {
  courseId: string;
  completed: boolean;
  quizScores: number[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export * from './User';
export * from './Quiz';
// ... export other types 