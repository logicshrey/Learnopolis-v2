import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import Video from '../src/models/Video';

const sampleVideos = [
  // Web Development - Beginner
  {
    title: 'HTML & CSS Fundamentals',
    description: 'Learn the basics of HTML and CSS to build your first web page. This video covers the essential elements, attributes, and styling properties you need to know.',
    videoId: 'qz0aGYrrlhU', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Web Development',
    duration: 1520 // 25:20 in seconds
  },
  {
    title: 'JavaScript Basics for Beginners',
    description: 'Start your journey with JavaScript by learning variables, data types, functions, and basic DOM manipulation.',
    videoId: 'W6NZfCO5SIk', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Web Development',
    duration: 2880 // 48:00 in seconds
  },
  
  // Web Development - Intermediate
  {
    title: 'Building Responsive Websites with Flexbox and Grid',
    description: 'Take your CSS skills to the next level by mastering modern layout techniques with Flexbox and CSS Grid.',
    videoId: 'JJSoEo8JSnc', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'Web Development',
    duration: 3600 // 60:00 in seconds
  },
  {
    title: 'React.js Crash Course',
    description: 'Learn the fundamentals of React.js including components, props, state, and hooks to build interactive user interfaces.',
    videoId: 'w7ejDZ8SWv8', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'Web Development',
    duration: 5400 // 90:00 in seconds
  },
  
  // Web Development - Advanced
  {
    title: 'Advanced React Patterns and Performance Optimization',
    description: 'Dive deep into advanced React patterns, context API, custom hooks, and techniques to optimize your React applications.',
    videoId: 'XxXyfkrP298', // Sample YouTube ID
    difficulty: 'advanced',
    subject: 'Web Development',
    duration: 4800 // 80:00 in seconds
  },
  
  // Data Science - Beginner
  {
    title: 'Introduction to Python for Data Science',
    description: 'Get started with Python programming for data science, covering basic syntax, data structures, and libraries like NumPy and Pandas.',
    videoId: 'LHBE6Q9XlzI', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Data Science',
    duration: 3600 // 60:00 in seconds
  },
  {
    title: 'Data Visualization Fundamentals',
    description: 'Learn how to create effective visualizations using Python libraries like Matplotlib and Seaborn to communicate insights from your data.',
    videoId: 'a9UrKTVEeZA', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Data Science',
    duration: 2700 // 45:00 in seconds
  },
  
  // Data Science - Intermediate
  {
    title: 'Machine Learning Algorithms Explained',
    description: 'Understand the theory and implementation of common machine learning algorithms including linear regression, decision trees, and clustering.',
    videoId: 'Gv9_4yMHFhI', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'Data Science',
    duration: 4200 // 70:00 in seconds
  },
  
  // Data Science - Advanced
  {
    title: 'Deep Learning with TensorFlow and Keras',
    description: 'Master deep learning concepts and build neural networks for image recognition, natural language processing, and more using TensorFlow and Keras.',
    videoId: 'tPYj3fFJGjk', // Sample YouTube ID
    difficulty: 'advanced',
    subject: 'Data Science',
    duration: 5400 // 90:00 in seconds
  },
  
  // AI - Beginner
  {
    title: 'Introduction to Artificial Intelligence',
    description: 'Explore the fundamentals of AI, its history, key concepts, and applications in today\'s world.',
    videoId: 'JMUxmLyrhSk', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'AI',
    duration: 3000 // 50:00 in seconds
  },
  
  // AI - Intermediate
  {
    title: 'Natural Language Processing Fundamentals',
    description: 'Learn the basics of NLP including tokenization, stemming, part-of-speech tagging, and sentiment analysis.',
    videoId: '8S3qHHUKqYk', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'AI',
    duration: 3900 // 65:00 in seconds
  },
  
  // AI - Advanced
  {
    title: 'Reinforcement Learning: From Theory to Practice',
    description: 'Dive into reinforcement learning algorithms, Markov decision processes, and how to implement RL agents for complex environments.',
    videoId: 'nyjbcRQ-uQ8', // Sample YouTube ID
    difficulty: 'advanced',
    subject: 'AI',
    duration: 4500 // 75:00 in seconds
  },
  
  // Computer Science - Beginner
  {
    title: 'Data Structures and Algorithms for Beginners',
    description: 'Learn the fundamental data structures (arrays, linked lists, stacks, queues) and basic algorithms that form the foundation of computer science.',
    videoId: 'BBpAmxU_NQo', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Computer Science',
    duration: 4200 // 70:00 in seconds
  },
  
  // Computer Science - Intermediate
  {
    title: 'Object-Oriented Programming Principles',
    description: 'Master the core concepts of OOP including encapsulation, inheritance, polymorphism, and abstraction with practical examples.',
    videoId: 'pTB0EiLXUC8', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'Computer Science',
    duration: 3600 // 60:00 in seconds
  },
  
  // Computer Science - Advanced
  {
    title: 'System Design and Architecture',
    description: 'Learn how to design scalable systems, microservices architecture, and best practices for building robust applications.',
    videoId: 'FLtqAi7WNBY', // Sample YouTube ID
    difficulty: 'advanced',
    subject: 'Computer Science',
    duration: 5100 // 85:00 in seconds
  },
  
  // Robotics - Beginner
  {
    title: 'Introduction to Robotics',
    description: 'Get started with robotics fundamentals, including mechanical components, sensors, actuators, and basic programming concepts.',
    videoId: 'jnRsNFO9JPM', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Robotics',
    duration: 3300 // 55:00 in seconds
  },
  
  // Blockchain - Beginner
  {
    title: 'Blockchain Technology Explained',
    description: 'Understand the core concepts of blockchain technology, how it works, and its applications beyond cryptocurrencies.',
    videoId: 'SSo_EIwHSd4', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Blockchain',
    duration: 2700 // 45:00 in seconds
  },
  
  // Cloud Computing - Intermediate
  {
    title: 'AWS Services for Developers',
    description: 'Learn about key AWS services including EC2, S3, Lambda, and how to use them to build scalable cloud applications.',
    videoId: 'ulprqHHWlng', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'Cloud Computing',
    duration: 4800 // 80:00 in seconds
  },
  
  // Game Development - Beginner
  {
    title: 'Getting Started with Unity Game Development',
    description: 'Learn the basics of Unity game engine, including the interface, GameObjects, components, and creating your first simple game.',
    videoId: 'E6A4WUpVSa0', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Game Development',
    duration: 3900 // 65:00 in seconds
  },
  
  // Mobile Development - Intermediate
  {
    title: 'React Native for Mobile App Development',
    description: 'Build cross-platform mobile applications using React Native, covering components, navigation, and accessing device features.',
    videoId: 'qSRrxpdMpVc', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'Mobile Development',
    duration: 4200 // 70:00 in seconds
  },
  
  // Cybersecurity - Advanced
  {
    title: 'Ethical Hacking and Penetration Testing',
    description: 'Learn advanced techniques for identifying and exploiting vulnerabilities in systems and networks, and how to secure them.',
    videoId: '3Kq1MIfTWCE', // Sample YouTube ID
    difficulty: 'advanced',
    subject: 'Cybersecurity',
    duration: 5700 // 95:00 in seconds
  }
];

async function seedVideos() {
  try {
    await connectDB();
    
    // Clear existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');
    
    // Insert sample videos
    const result = await Video.insertMany(sampleVideos);
    console.log(`Successfully seeded ${result.length} videos`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding videos:', error);
    process.exit(1);
  }
}

seedVideos(); 