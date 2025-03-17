import { User, Course, UserProgress } from '@/types';
import * as tf from '@tensorflow/tfjs';

interface UserFeatures {
  completionRates: Record<string, number>;
  averageScores: Record<string, number>;
  difficultyPreferences: Record<string, number>;
  subjectPreferences: Record<string, number>;
}

export class RecommendationSystem {
  private model: tf.Sequential;

  constructor() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 64, activation: 'relu', inputShape: [10] }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });
  }

  private async preprocessUserData(user: User) {
    // Convert user data into features
    const features = [
      user.level,
      user.points,
      user.progress.length,
      // Add more relevant features
    ];
    
    return tf.tensor2d([features]);
  }

  private extractUserFeatures(user: User): UserFeatures {
    const features: UserFeatures = {
      completionRates: {},
      averageScores: {},
      difficultyPreferences: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      },
      subjectPreferences: {},
    };

    user.progress.forEach((progress: UserProgress) => {
      // Calculate completion rates
      const course = progress.courseId as unknown as Course;
      const completionRate = progress.completedModules.length / course.modules.length;
      features.completionRates[course.difficulty] = 
        (features.completionRates[course.difficulty] || 0) + completionRate;

      // Calculate average scores
      const scores = Object.values(progress.quizScores);
      if (scores.length > 0) {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        features.averageScores[course.difficulty] = 
          (features.averageScores[course.difficulty] || 0) + avgScore;
      }

      // Track difficulty preferences
      features.difficultyPreferences[course.difficulty]++;

      // Track subject preferences
      course.subjects.forEach(subject => {
        features.subjectPreferences[subject] = 
          (features.subjectPreferences[subject] || 0) + 1;
      });
    });

    return features;
  }

  public async getRecommendations(user: User, availableCourses: Course[]): Promise<Course[]> {
    const features = this.extractUserFeatures(user);
    
    // Calculate course scores based on user features
    const scoredCourses = availableCourses.map(course => {
      let score = 0;

      // Difficulty score based on user performance and preferences
      const difficultyScore = features.difficultyPreferences[course.difficulty] || 0;
      const completionRate = features.completionRates[course.difficulty] || 0;
      const avgScore = features.averageScores[course.difficulty] || 0;

      score += difficultyScore * 0.3;
      score += completionRate * 0.2;
      score += (avgScore / 100) * 0.2;

      // Subject preference score
      const subjectScore = course.subjects.reduce((acc, subject) => 
        acc + (features.subjectPreferences[subject] || 0), 0);
      score += (subjectScore / course.subjects.length) * 0.3;

      // Adjust score based on user level
      if (course.difficulty === 'beginner' && user.level > 5) {
        score *= 0.7;
      } else if (course.difficulty === 'advanced' && user.level < 3) {
        score *= 0.5;
      }

      return { course, score };
    });

    // Sort by score and return top recommendations
    return scoredCourses
      .sort((a, b) => b.score - a.score)
      .map(({ course }) => course)
      .slice(0, 6);
  }

  public async updateModel(user: User, course: Course, engagement: number) {
    // Train model with new data
    const userFeatures = await this.preprocessUserData(user);
    const labels = tf.tensor2d([[engagement]]);

    await this.model.fit(userFeatures, labels, {
      epochs: 1,
      verbose: 0
    });
  }
} 