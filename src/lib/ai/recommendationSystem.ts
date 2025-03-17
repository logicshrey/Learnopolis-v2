import { User, Course, UserProgress } from '@/types';

interface UserFeatures {
  completionRates: Record<string, number>;
  averageScores: Record<string, number>;
  subjects: Set<string>;
  level: number;
}

export class RecommendationSystem {
  private getUserFeatures(user: User): UserFeatures {
    const completionRates: Record<string, number> = {};
    const averageScores: Record<string, number> = {};
    const subjects = new Set<string>();

    user.progress.forEach((progress) => {
      const courseData = typeof progress.courseId === 'object' ? progress.courseId : null;
      if (courseData && 'subjects' in courseData) {
        courseData.subjects.forEach(subject => subjects.add(subject));
        
        // Fix the reduce error by checking if quizScores is an array
        if (Array.isArray(progress.quizScores) && progress.quizScores.length > 0) {
          const avgScore = progress.quizScores.reduce((a: number, b: number) => a + b, 0) / progress.quizScores.length;
          completionRates[courseData._id.toString()] = progress.completed ? 1 : 0;
          averageScores[courseData._id.toString()] = avgScore;
        }
      }
    });

    return {
      completionRates,
      averageScores,
      subjects,
      level: user.level || 1
    };
  }

  private calculateCourseScore(course: Course, userFeatures: UserFeatures): number {
    let score = 0;

    // Subject match bonus
    course.subjects.forEach(subject => {
      if (userFeatures.subjects.has(subject)) {
        score += 2;
      }
    });

    // Difficulty level match
    const difficultyMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    const courseDifficulty = difficultyMap[course.difficulty] || 1;
    const userLevel = Math.ceil(userFeatures.level / 3);
    score += 3 - Math.abs(courseDifficulty - userLevel);

    // Popularity bonus
    if (course.enrollmentCount > 200) score += 1;
    
    return score;
  }

  public getRecommendations(user: User, availableCourses: Course[]): Course[] {
    const userFeatures = this.getUserFeatures(user);
    
    // Filter out courses user has already completed
    const uncompletedCourses = availableCourses.filter(course => 
      !userFeatures.completionRates[course._id]
    );

    // Score and sort courses
    const scoredCourses = uncompletedCourses.map(course => ({
      course,
      score: this.calculateCourseScore(course, userFeatures)
    }));

    scoredCourses.sort((a, b) => b.score - a.score);

    // Return top 5 recommendations
    return scoredCourses.slice(0, 5).map(sc => sc.course);
  }
} 