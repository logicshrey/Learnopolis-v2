export interface User {
  id: string;
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
  id: string;
  _id?: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subjects: string[];
  modules: Module[];
  enrollmentCount: number;
  createdAt?: Date;
  averageRating?: number;
}

export interface Module {
  id: number;
  title: string;
  content: string;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface UserProgress {
  courseId: string | Course;
  completedModules: number[];
  quizScores: Record<string, number>;
  completed: boolean;
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