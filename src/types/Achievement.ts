export interface Achievement {
  id: string;      // based on your component usage
  type: string;    // for level_up or course_complete
  title: string;   // based on your component usage
  description: string;  // based on your component usage
  earnedAt: string | Date;  // based on your component usage
} 