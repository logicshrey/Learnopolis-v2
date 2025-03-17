import { Course, User, UserProgress } from '@/types';

interface UserProfile {
  // Subject preferences based on enrollment and completion
  subjectPreferences: Map<string, number>;
  // Difficulty level preferences
  difficultyPreferences: Map<string, number>;
  // Learning patterns
  averageCompletionRate: number;
  averageQuizScore: number;
  // User level and experience
  userLevel: number;
  completedCourseIds: string[];
  enrolledCourseIds: string[];
}

interface Course {
  id?: string;
  _id?: string;
  // ... other course properties
}

export class RecommendationEngine {
  // Build a comprehensive user profile based on their activity
  private buildUserProfile(user: User): UserProfile {
    const subjectPreferences = new Map<string, number>();
    const difficultyPreferences = new Map<string, number>();
    let totalCompletionRate = 0;
    let totalQuizScore = 0;
    let courseCount = 0;
    let quizCount = 0;
    
    const completedCourseIds: string[] = [];
    const enrolledCourseIds: string[] = [];
    
    // Process user progress data
    user.progress.forEach((progress) => {
      let courseId = '';
      if (typeof progress.courseId === 'string') {
        courseId = progress.courseId;
      } else if (progress.courseId && progress.courseId._id) {
        courseId = progress.courseId._id.toString();
      }
      
      if (courseId) {
        enrolledCourseIds.push(courseId);
      }
      
      if (progress.completed) {
        completedCourseIds.push(courseId);
      }
      
      // Get course data if available
      const courseData = typeof progress.courseId === 'object' ? progress.courseId : null;
      
      if (courseData) {
        // Track subject preferences
        courseData.subjects.forEach(subject => {
          const currentValue = subjectPreferences.get(subject) || 0;
          // Weight completed courses higher
          const weight = progress.completed ? 2 : 1;
          subjectPreferences.set(subject, currentValue + weight);
        });
        
        // Track difficulty preferences
        const difficulty = courseData.difficulty;
        const currentDiffValue = difficultyPreferences.get(difficulty) || 0;
        // Weight completed courses higher
        const diffWeight = progress.completed ? 2 : 1;
        difficultyPreferences.set(difficulty, currentDiffValue + diffWeight);
        
        // Calculate completion rate
        if (courseData.modules && courseData.modules.length > 0) {
          const completionRate = progress.completedModules.length / courseData.modules.length;
          totalCompletionRate += completionRate;
          courseCount++;
        }
      }
      
      // Calculate average quiz score
      if (progress.quizScores) {
        const scores = Object.values(progress.quizScores);
        if (scores.length > 0) {
          const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
          totalQuizScore += avgScore;
          quizCount++;
        }
      }
    });
    
    return {
      subjectPreferences,
      difficultyPreferences,
      averageCompletionRate: courseCount > 0 ? totalCompletionRate / courseCount : 0,
      averageQuizScore: quizCount > 0 ? totalQuizScore / quizCount : 0,
      userLevel: user.level || 1,
      completedCourseIds,
      enrolledCourseIds
    };
  }
  
  // Calculate course score based on user profile
  private calculateCourseScore(course: Course, userProfile: UserProfile): number {
    let score = 0;
    
    // Subject match score (0-5)
    const subjectScore = course.subjects.reduce((sum, subject) => {
      const preference = userProfile.subjectPreferences.get(subject) || 0;
      return sum + (preference * 0.5); // Scale the preference
    }, 0);
    score += Math.min(subjectScore, 5); // Cap at 5 points
    
    // Difficulty appropriateness score (0-3)
    const difficultyMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const courseDifficulty = difficultyMap[course.difficulty] || 2;
    const userLevelNormalized = Math.ceil(userProfile.userLevel / 2); // Convert user level to 1-3 scale
    
    // Perfect match gets 3 points, one level difference gets 2, two levels gets 1
    const difficultyDifference = Math.abs(courseDifficulty - userLevelNormalized);
    const difficultyScore = difficultyDifference === 0 ? 3 : (difficultyDifference === 1 ? 2 : 1);
    score += difficultyScore;
    
    // Preference for difficulty level (0-2)
    const difficultyPreference = userProfile.difficultyPreferences.get(course.difficulty) || 0;
    score += Math.min(difficultyPreference * 0.5, 2); // Cap at 2 points
    
    // Learning pattern match (0-2)
    // If user completes courses quickly, recommend more challenging courses
    if (userProfile.averageCompletionRate > 0.8 && userProfile.averageQuizScore > 80) {
      if (course.difficulty === 'advanced') score += 2;
      else if (course.difficulty === 'intermediate') score += 1;
    }
    // If user struggles, recommend more accessible courses
    else if (userProfile.averageCompletionRate < 0.5 || userProfile.averageQuizScore < 70) {
      if (course.difficulty === 'beginner') score += 2;
      else if (course.difficulty === 'intermediate') score += 1;
    }
    // Otherwise, match current level
    else {
      if (course.difficulty === 'intermediate') score += 2;
      else score += 1;
    }
    
    // Popularity boost (0-1)
    const normalizedEnrollment = Math.min(course.enrollmentCount / 100, 1);
    score += normalizedEnrollment;
    
    // Diversity bonus - encourage exploring new subjects (0-2)
    const newSubjects = course.subjects.filter(subject => 
      !userProfile.subjectPreferences.has(subject) || userProfile.subjectPreferences.get(subject)! < 1
    );
    score += newSubjects.length * 0.5; // 0.5 points per new subject, up to 2 points
    
    return score;
  }
  
  // Get personalized recommendations for a user
  public getRecommendations(user: User, availableCourses: Course[]): Course[] {
    // Build user profile
    const userProfile = this.buildUserProfile(user);
    
    // Filter out courses the user is already enrolled in
    const unenrolledCourses = availableCourses.filter(course => {
      const courseId = course.id || course._id;
      if (!courseId) return true; // Include courses without IDs or handle differently
      return !userProfile.enrolledCourseIds.includes(courseId.toString());
    });
    
    // If no courses available or user has no history, return popular courses
    if (unenrolledCourses.length === 0 || user.progress.length === 0) {
      return availableCourses
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 6);
    }
    
    // Calculate score for each course
    const scoredCourses = unenrolledCourses.map(course => ({
      course,
      score: this.calculateCourseScore(course, userProfile)
    }));
    
    // Sort by score and return top recommendations
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.course);
  }
} 