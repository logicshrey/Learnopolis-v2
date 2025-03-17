import { connectDB } from '@/lib/db';
import Course from '@/models/Course';

async function seed() {
  try {
    await connectDB();

    // Clear existing courses
    await Course.deleteMany({});

    // Create sample courses
    const courses = await Course.create([
      {
        title: 'Introduction to Electronics',
        description: 'Learn the basics of electronic circuits and components',
        difficulty: 'beginner',
        thumbnail: '/images/electronics.jpg',
        duration: '6 weeks',
        subjects: ['electronics', 'circuits'],
        modules: [
          {
            title: 'Basic Circuit Components',
            content: 'Introduction to resistors, capacitors, and inductors...',
            quizzes: [
              {
                questions: [
                  {
                    question: 'What is Ohm\'s Law?',
                    options: [
                      'V = IR',
                      'P = IV',
                      'I = V/R',
                      'All of the above'
                    ],
                    correctAnswer: 3
                  }
                ],
                timeLimit: 300,
                points: 100
              }
            ],
            points: 100
          }
        ]
      },
      {
        title: 'Mechanical Engineering Fundamentals',
        description: 'Master the core concepts of mechanical engineering',
        difficulty: 'intermediate',
        thumbnail: '/images/mechanical.jpg',
        duration: '8 weeks',
        subjects: ['mechanics', 'engineering'],
        modules: [
          {
            title: 'Statics and Dynamics',
            content: 'Understanding forces and motion...',
            quizzes: [
              {
                questions: [
                  {
                    question: 'What is Newton\'s First Law?',
                    options: [
                      'F = ma',
                      'Objects in motion stay in motion',
                      'For every action there is an equal and opposite reaction',
                      'None of the above'
                    ],
                    correctAnswer: 1
                  }
                ],
                timeLimit: 300,
                points: 100
              }
            ],
            points: 100
          }
        ]
      }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 