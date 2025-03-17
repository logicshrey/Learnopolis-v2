interface Challenge {
  id: string | number;
  title: string;
  // ... other challenge properties
}

export interface Module {
  id: string | number;
  title: string;
  content: string;
  points: number;
  quizzes: Quiz[];
  challenges: Challenge[];
} 