import { Course, User } from '@/types';

interface LearningPath {
  title: string;
  description: string;
  courses: Course[];
  estimatedTimeToComplete: string;
  skillsGained: string[];
}

export class LearningPathGenerator {
  private readonly PATHS = {
    'web_development': {
      title: 'Full-Stack Web Development',
      description: 'Master the art of building web applications from front to back',
      requiredSubjects: ['Web Development', 'Computer Science', 'UI/UX'],
      skillsGained: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases']
    },
    'data_science': {
      title: 'Data Science & Machine Learning',
      description: 'Learn to analyze data and build predictive models',
      requiredSubjects: ['Data Science', 'AI', 'Computer Science', 'Statistics'],
      skillsGained: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization']
    },
    'robotics': {
      title: 'Robotics & Automation',
      description: 'Build and program robots for the future',
      requiredSubjects: ['Robotics', 'Mechanical Engineering', 'Electronics'],
      skillsGained: ['Sensors', 'Actuators', 'Control Systems', 'Programming']
    },
    'renewable_energy': {
      title: 'Renewable Energy Systems',
      description: 'Design and implement sustainable energy solutions',
      requiredSubjects: ['Energy', 'Environmental Engineering', 'Electrical Engineering'],
      skillsGained: ['Solar Energy', 'Wind Power', 'Energy Storage', 'Sustainability']
    },
    'cybersecurity': {
      title: 'Cybersecurity Professional',
      description: 'Protect systems and networks from digital threats',
      requiredSubjects: ['Cybersecurity', 'Computer Science', 'Networking'],
      skillsGained: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Security Analysis']
    },
    'blockchain': {
      title: 'Blockchain Developer',
      description: 'Build decentralized applications and smart contracts',
      requiredSubjects: ['Blockchain', 'Computer Science', 'Cryptography'],
      skillsGained: ['Smart Contracts', 'Cryptocurrency', 'Distributed Systems', 'Web3']
    },
    'game_development': {
      title: 'Game Development',
      description: 'Create engaging and immersive gaming experiences',
      requiredSubjects: ['Game Development', 'Computer Science', 'Design'],
      skillsGained: ['Unity', 'C#', 'Game Design', '3D Modeling', 'Animation']
    },
    'cloud_computing': {
      title: 'Cloud Solutions Architect',
      description: 'Design and implement scalable cloud infrastructure',
      requiredSubjects: ['Cloud Computing', 'DevOps', 'Computer Science'],
      skillsGained: ['AWS', 'Azure', 'Infrastructure as Code', 'Containerization', 'Microservices']
    }
  };

  public generateLearningPaths(user: User, availableCourses: Course[]): LearningPath[] {
    const paths: LearningPath[] = [];
    
    // Group courses by subject
    const coursesBySubject = new Map<string, Course[]>();
    availableCourses.forEach(course => {
      course.subjects.forEach(subject => {
        if (!coursesBySubject.has(subject)) {
          coursesBySubject.set(subject, []);
        }
        coursesBySubject.get(subject)!.push(course);
      });
    });
    
    // Generate paths based on available courses
    Object.entries(this.PATHS).forEach(([pathId, pathInfo]) => {
      // Check if we have enough courses for this path
      const pathCourses: Course[] = [];
      
      // Get beginner courses first
      pathInfo.requiredSubjects.forEach(subject => {
        const subjectCourses = coursesBySubject.get(subject) || [];
        const beginnerCourses = subjectCourses.filter(c => c.difficulty === 'beginner');
        if (beginnerCourses.length > 0) {
          pathCourses.push(beginnerCourses[0]);
        }
      });
      
      // Then intermediate courses
      pathInfo.requiredSubjects.forEach(subject => {
        const subjectCourses = coursesBySubject.get(subject) || [];
        const intermediateCourses = subjectCourses.filter(c => c.difficulty === 'intermediate');
        if (intermediateCourses.length > 0) {
          pathCourses.push(intermediateCourses[0]);
        }
      });
      
      // Then advanced courses
      pathInfo.requiredSubjects.forEach(subject => {
        const subjectCourses = coursesBySubject.get(subject) || [];
        const advancedCourses = subjectCourses.filter(c => c.difficulty === 'advanced');
        if (advancedCourses.length > 0) {
          pathCourses.push(advancedCourses[0]);
        }
      });
      
      // Only add path if we have at least 3 courses
      if (pathCourses.length >= 3) {
        // Sort by difficulty
        pathCourses.sort((a, b) => {
          const difficultyMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return difficultyMap[a.difficulty] - difficultyMap[b.difficulty];
        });
        
        // Calculate estimated time (assume 2 weeks per course)
        const estimatedWeeks = pathCourses.length * 2;
        
        paths.push({
          title: pathInfo.title,
          description: pathInfo.description,
          courses: pathCourses,
          estimatedTimeToComplete: `${estimatedWeeks} weeks`,
          skillsGained: pathInfo.skillsGained
        });
      }
    });
    
    return paths;
  }
} 