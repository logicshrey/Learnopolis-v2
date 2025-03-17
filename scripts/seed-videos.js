const mongoose = require('mongoose');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnopolis';

// Connect to MongoDB directly
async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Define the Video model schema
const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);

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
  
  // AI - Intermediate
  {
    title: 'Natural Language Processing Fundamentals',
    description: 'Learn the basics of NLP including tokenization, stemming, part-of-speech tagging, and sentiment analysis.',
    videoId: '8S3qHHUKqYk', // Sample YouTube ID
    difficulty: 'intermediate',
    subject: 'AI',
    duration: 3900 // 65:00 in seconds
  },
  
  // Computer Science - Beginner
  {
    title: 'Data Structures and Algorithms for Beginners',
    description: 'Learn the fundamental data structures (arrays, linked lists, stacks, queues) and basic algorithms that form the foundation of computer science.',
    videoId: 'BBpAmxU_NQo', // Sample YouTube ID
    difficulty: 'beginner',
    subject: 'Computer Science',
    duration: 4200 // 70:00 in seconds
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
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding videos:', error);
    process.exit(1);
  }
}

seedVideos(); 