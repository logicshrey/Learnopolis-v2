import { connectDB } from '@/lib/db';
import Course from '@/models/Course';

const sampleCourses = [
  {
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning algorithms, data preprocessing, and model evaluation. This course covers supervised and unsupervised learning techniques.",
    difficulty: "beginner",
    subjects: ["AI", "Computer Science", "Data Science"],
    modules: [
      {
        title: "Understanding Machine Learning Basics",
        content: "<h2>What is Machine Learning?</h2><p>Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.</p><h3>Key Concepts</h3><ul><li>Supervised vs Unsupervised Learning</li><li>Training and Test Data</li><li>Model Evaluation</li></ul>",
        quiz: [
          {
            question: "Which of the following is NOT a type of machine learning?",
            options: ["Supervised Learning", "Unsupervised Learning", "Deterministic Learning", "Reinforcement Learning"],
            correctAnswer: 2
          },
          {
            question: "What is the purpose of splitting data into training and test sets?",
            options: ["To save computational resources", "To evaluate model performance on unseen data", "To create more data", "To simplify the algorithm"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Data Preprocessing Techniques",
        content: "<h2>Why Data Preprocessing Matters</h2><p>Raw data is often incomplete, inconsistent, and may contain errors. Data preprocessing transforms raw data into a clean dataset for better analysis.</p><h3>Common Preprocessing Steps</h3><ul><li>Data Cleaning</li><li>Feature Scaling</li><li>Feature Engineering</li><li>Dimensionality Reduction</li></ul>",
        quiz: [
          {
            question: "Which of these is NOT a common data preprocessing step?",
            options: ["Normalization", "Feature Engineering", "Algorithm Selection", "Missing Value Imputation"],
            correctAnswer: 2
          },
          {
            question: "Why is feature scaling important?",
            options: ["It makes the algorithm run faster", "It ensures features with larger values don't dominate the learning process", "It increases the dataset size", "It simplifies the model architecture"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Supervised Learning Algorithms",
        content: "<h2>Supervised Learning</h2><p>Supervised learning uses labeled training data to learn the mapping function from input variables to output variables.</p><h3>Popular Algorithms</h3><ul><li>Linear Regression</li><li>Decision Trees</li><li>Support Vector Machines</li><li>Neural Networks</li></ul>",
        quiz: [
          {
            question: "Which algorithm is best suited for predicting continuous values?",
            options: ["Logistic Regression", "Linear Regression", "K-Means Clustering", "Decision Trees"],
            correctAnswer: 1
          },
          {
            question: "What type of problem is spam detection?",
            options: ["Regression", "Clustering", "Classification", "Dimensionality Reduction"],
            correctAnswer: 2
          }
        ]
      }
    ],
    enrollmentCount: 245
  },
  {
    title: "Advanced Structural Engineering",
    description: "Explore advanced concepts in structural analysis, design of complex structures, and modern construction techniques for civil engineers.",
    difficulty: "advanced",
    subjects: ["Civil Engineering", "Mechanics", "Construction"],
    modules: [
      {
        title: "Advanced Structural Analysis",
        content: "<h2>Modern Structural Analysis Methods</h2><p>This module covers advanced techniques for analyzing complex structures under various loading conditions.</p><h3>Topics Covered</h3><ul><li>Finite Element Analysis</li><li>Dynamic Response of Structures</li><li>Non-linear Analysis</li></ul>",
        quiz: [
          {
            question: "Which method is most suitable for analyzing complex structural geometries?",
            options: ["Hand calculations", "Finite Element Analysis", "Simple beam theory", "Moment distribution"],
            correctAnswer: 1
          },
          {
            question: "What is the primary advantage of non-linear analysis?",
            options: ["It's faster to compute", "It's easier to implement", "It provides more accurate results for large deformations", "It requires less input data"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "Earthquake Resistant Design",
        content: "<h2>Designing for Seismic Forces</h2><p>Learn how to design structures that can withstand earthquake forces through proper detailing and material selection.</p><h3>Key Principles</h3><ul><li>Ductility in Design</li><li>Base Isolation Techniques</li><li>Seismic Retrofitting</li></ul>",
        quiz: [
          {
            question: "Which property is most important for earthquake-resistant structures?",
            options: ["High strength", "High ductility", "Low weight", "High stiffness"],
            correctAnswer: 1
          },
          {
            question: "What is the purpose of base isolation in seismic design?",
            options: ["To increase the building's weight", "To reduce the transmission of ground motion to the structure", "To increase the building's stiffness", "To reduce construction costs"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 128
  },
  {
    title: "Fundamentals of Electrical Circuits",
    description: "Master the basics of electrical circuit analysis, including DC and AC circuits, network theorems, and practical applications.",
    difficulty: "beginner",
    subjects: ["Electrical Engineering", "Electronics", "Physics"],
    modules: [
      {
        title: "DC Circuit Analysis",
        content: "<h2>Understanding DC Circuits</h2><p>This module covers the fundamental principles of direct current circuits and analysis techniques.</p><h3>Topics Covered</h3><ul><li>Ohm's Law</li><li>Kirchhoff's Laws</li><li>Series and Parallel Circuits</li><li>Thevenin's and Norton's Theorems</li></ul>",
        quiz: [
          {
            question: "What is Ohm's Law?",
            options: ["P = IV", "V = IR", "I = V/Z", "V = L(dI/dt)"],
            correctAnswer: 1
          },
          {
            question: "Which theorem allows us to simplify a complex circuit into a single voltage source and series resistor?",
            options: ["Norton's Theorem", "Thevenin's Theorem", "Superposition Theorem", "Maximum Power Transfer Theorem"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "AC Circuit Analysis",
        content: "<h2>Alternating Current Fundamentals</h2><p>Learn how to analyze circuits with time-varying signals using phasors and complex impedance.</p><h3>Key Concepts</h3><ul><li>Sinusoidal Waveforms</li><li>Phasors and Complex Numbers</li><li>Impedance and Admittance</li><li>Power in AC Circuits</li></ul>",
        quiz: [
          {
            question: "What is the impedance of a pure capacitor?",
            options: ["Z = R", "Z = jωL", "Z = 1/jωC", "Z = R + jωL"],
            correctAnswer: 2
          },
          {
            question: "In an AC circuit, what does the power factor represent?",
            options: ["The ratio of real power to apparent power", "The ratio of reactive power to real power", "The product of voltage and current", "The phase angle between voltage and current"],
            correctAnswer: 0
          }
        ]
      }
    ],
    enrollmentCount: 312
  },
  {
    title: "Robotics and Automation",
    description: "Explore the principles of robotics, automation systems, sensors, actuators, and programming for modern industrial applications.",
    difficulty: "intermediate",
    subjects: ["Robotics", "Mechanical Engineering", "Computer Science"],
    modules: [
      {
        title: "Introduction to Robotics",
        content: "<h2>Fundamentals of Robotics</h2><p>This module introduces the basic concepts of robotics, including kinematics, dynamics, and control systems.</p><h3>Topics Covered</h3><ul><li>Robot Classification</li><li>Degrees of Freedom</li><li>Forward and Inverse Kinematics</li><li>Robot Coordinate Systems</li></ul>",
        quiz: [
          {
            question: "What does DOF stand for in robotics?",
            options: ["Depth of Field", "Digital Output Format", "Degrees of Freedom", "Direction of Force"],
            correctAnswer: 2
          },
          {
            question: "Which of the following is NOT a type of robot joint?",
            options: ["Revolute", "Prismatic", "Spherical", "Diagonal"],
            correctAnswer: 3
          }
        ]
      },
      {
        title: "Sensors and Actuators",
        content: "<h2>Robot Perception and Action</h2><p>Learn about the various sensors and actuators used in robotics for sensing the environment and performing actions.</p><h3>Common Sensors</h3><ul><li>Vision Sensors</li><li>Proximity Sensors</li><li>Force/Torque Sensors</li><li>Inertial Measurement Units</li></ul><h3>Actuator Types</h3><ul><li>Electric Motors</li><li>Hydraulic Actuators</li><li>Pneumatic Systems</li><li>Piezoelectric Actuators</li></ul>",
        quiz: [
          {
            question: "Which sensor would be most appropriate for detecting the distance to an object?",
            options: ["Temperature sensor", "Ultrasonic sensor", "Gyroscope", "Current sensor"],
            correctAnswer: 1
          },
          {
            question: "What is the main advantage of hydraulic actuators over electric motors?",
            options: ["Lower cost", "Higher precision", "Higher power-to-weight ratio", "Simpler control systems"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "Robot Programming",
        content: "<h2>Programming Robots</h2><p>This module covers different approaches to programming robots, from teach pendants to high-level languages.</p><h3>Programming Methods</h3><ul><li>Teach Pendant Programming</li><li>Offline Programming</li><li>Text-based Languages (Python, C++)</li><li>ROS (Robot Operating System)</li></ul>",
        quiz: [
          {
            question: "What is ROS in robotics?",
            options: ["Robot Orientation System", "Robot Operating System", "Remote Operation Software", "Robotic Output Simulator"],
            correctAnswer: 1
          },
          {
            question: "Which programming method involves physically moving the robot to desired positions?",
            options: ["Offline programming", "Teach pendant programming", "Simulation-based programming", "Text-based programming"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 187
  },
  {
    title: "Renewable Energy Systems",
    description: "Learn about various renewable energy technologies, system design, integration, and the economics of sustainable energy solutions.",
    difficulty: "intermediate",
    subjects: ["Energy", "Environmental Engineering", "Electrical Engineering"],
    modules: [
      {
        title: "Solar Energy Systems",
        content: "<h2>Harnessing Solar Power</h2><p>This module covers the principles of solar energy conversion, photovoltaic systems, and solar thermal applications.</p><h3>Topics Covered</h3><ul><li>Photovoltaic Effect</li><li>Types of Solar Cells</li><li>Solar Panel Design</li><li>Grid-Connected vs. Off-Grid Systems</li></ul>",
        quiz: [
          {
            question: "What semiconductor material is most commonly used in commercial solar cells?",
            options: ["Germanium", "Silicon", "Gallium Arsenide", "Cadmium Telluride"],
            correctAnswer: 1
          },
          {
            question: "What is the purpose of an inverter in a solar PV system?",
            options: ["To store energy", "To convert DC to AC", "To track the sun's position", "To clean the solar panels"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Wind Energy Technology",
        content: "<h2>Wind Power Fundamentals</h2><p>Learn about wind turbine technology, aerodynamics, and wind farm design principles.</p><h3>Key Concepts</h3><ul><li>Wind Resource Assessment</li><li>Horizontal vs. Vertical Axis Turbines</li><li>Power Curve Analysis</li><li>Wind Farm Layout Optimization</li></ul>",
        quiz: [
          {
            question: "What is the theoretical maximum efficiency of a wind turbine according to Betz's Law?",
            options: ["100%", "59.3%", "75%", "33.3%"],
            correctAnswer: 1
          },
          {
            question: "Which factor is most critical in selecting a site for a wind farm?",
            options: ["Proximity to urban areas", "Average wind speed", "Land cost", "Soil type"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 156
  }
];

async function seedCourses() {
  try {
    await connectDB();
    
    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert sample courses
    await Course.insertMany(sampleCourses);
    
    console.log('Database seeded successfully with sample courses!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedCourses(); 