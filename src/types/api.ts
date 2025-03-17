export interface UserProgress {
  courseId: string;
  completed: boolean;
  quizScores: number[];
}

export interface UserData {
  name: string;
  email: string;
  username: string;
  password: string;
  points: number;
  level: number;
  streak: number;
  progress: UserProgress[];
  achievements: string[];
  dailyChallenges: string[];
  certificates: string[];
}

export interface ApiError {
  message: string;
} 