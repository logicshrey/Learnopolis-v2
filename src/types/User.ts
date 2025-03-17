interface Badge {
  id: string;
  name: string;
  image: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  points: number;
  badges: Badge[];
  // ... any other properties your user might have
} 