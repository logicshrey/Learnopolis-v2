import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/db';
import Course from '@/models/Course';

// Expanded sample courses data with more variety
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
  },
  {
    title: "Web Development Bootcamp",
    description: "A comprehensive course covering HTML, CSS, JavaScript, and modern frameworks to build responsive and interactive web applications.",
    difficulty: "beginner",
    subjects: ["Web Development", "Computer Science", "UI/UX"],
    modules: [
      {
        title: "HTML and CSS Fundamentals",
        content: "<h2>Building the Web's Structure and Style</h2><p>Learn the core building blocks of web pages and how to style them beautifully.</p><h3>Topics Covered</h3><ul><li>HTML5 Semantic Elements</li><li>CSS Box Model</li><li>Flexbox and Grid Layout</li><li>Responsive Design Principles</li></ul>",
        quiz: [
          {
            question: "Which HTML element is used to define the main content area of a document?",
            options: ["<div>", "<content>", "<main>", "<section>"],
            correctAnswer: 2
          },
          {
            question: "Which CSS property is used to create space between elements' borders?",
            options: ["padding", "margin", "spacing", "border-gap"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "JavaScript Essentials",
        content: "<h2>Adding Interactivity to Websites</h2><p>Master the fundamentals of JavaScript to create dynamic and interactive web experiences.</p><h3>Key Concepts</h3><ul><li>Variables and Data Types</li><li>Functions and Scope</li><li>DOM Manipulation</li><li>Event Handling</li></ul>",
        quiz: [
          {
            question: "Which method is used to select an HTML element by its ID in JavaScript?",
            options: ["document.query()", "document.getElementById()", "document.findElement()", "document.selectById()"],
            correctAnswer: 1
          },
          {
            question: "What does the 'const' keyword do in JavaScript?",
            options: ["Declares a variable that can be reassigned", "Declares a constant value that cannot be reassigned", "Creates a constructor function", "Defines a constant object that can be modified"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 478
  },
  {
    title: "Data Science with Python",
    description: "Learn to analyze and visualize data using Python libraries like Pandas, NumPy, and Matplotlib to extract meaningful insights.",
    difficulty: "intermediate",
    subjects: ["Data Science", "Computer Science", "Statistics"],
    modules: [
      {
        title: "Python for Data Analysis",
        content: "<h2>Data Manipulation with Python</h2><p>Learn how to use Python's powerful libraries to clean, transform, and analyze data.</p><h3>Topics Covered</h3><ul><li>NumPy Arrays and Operations</li><li>Pandas DataFrames</li><li>Data Cleaning Techniques</li><li>Exploratory Data Analysis</li></ul>",
        quiz: [
          {
            question: "Which Python library is primarily used for data manipulation and analysis?",
            options: ["NumPy", "Matplotlib", "Pandas", "SciPy"],
            correctAnswer: 2
          },
          {
            question: "What function would you use to handle missing values in a Pandas DataFrame?",
            options: ["df.missing()", "df.fillna()", "df.dropnull()", "df.clean()"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Data Visualization",
        content: "<h2>Telling Stories with Data</h2><p>Master the art of creating compelling visualizations to communicate insights effectively.</p><h3>Key Libraries</h3><ul><li>Matplotlib</li><li>Seaborn</li><li>Plotly</li><li>Dashboard Creation</li></ul>",
        quiz: [
          {
            question: "Which type of plot is best for showing the distribution of a continuous variable?",
            options: ["Bar chart", "Pie chart", "Histogram", "Scatter plot"],
            correctAnswer: 2
          },
          {
            question: "What is the primary advantage of interactive visualizations?",
            options: ["They load faster", "They allow users to explore data from different angles", "They use less memory", "They are easier to create"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 356
  },
  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications for iOS and Android using React Native and JavaScript.",
    difficulty: "intermediate",
    subjects: ["Mobile Development", "Computer Science", "UI/UX"],
    modules: [
      {
        title: "React Native Fundamentals",
        content: "<h2>Building Blocks of React Native</h2><p>Learn the core concepts of React Native to create mobile applications.</p><h3>Topics Covered</h3><ul><li>Components and Props</li><li>State Management</li><li>Navigation</li><li>Styling in React Native</li></ul>",
        quiz: [
          {
            question: "What is the difference between React and React Native?",
            options: ["React is for web, React Native is for mobile", "React is older than React Native", "React uses JavaScript, React Native uses Java", "There is no difference"],
            correctAnswer: 0
          },
          {
            question: "Which component would you use to create a scrollable list in React Native?",
            options: ["<ScrollView>", "<ListView>", "<FlatList>", "<List>"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "Native Device Features",
        content: "<h2>Accessing Device Capabilities</h2><p>Learn how to integrate with native device features like camera, location, and storage.</p><h3>Key APIs</h3><ul><li>Camera and Image Picker</li><li>Geolocation</li><li>AsyncStorage</li><li>Push Notifications</li></ul>",
        quiz: [
          {
            question: "Which API would you use to store persistent data in React Native?",
            options: ["LocalStorage", "AsyncStorage", "SQLite", "Redux"],
            correctAnswer: 1
          },
          {
            question: "What permission is required to access a user's location in the background?",
            options: ["android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_BACKGROUND_LOCATION", "android.permission.LOCATION", "android.permission.GPS"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 289
  },
  {
    title: "Blockchain Technology and Applications",
    description: "Understand the fundamentals of blockchain technology, cryptocurrencies, smart contracts, and decentralized applications.",
    difficulty: "advanced",
    subjects: ["Blockchain", "Computer Science", "Cryptography"],
    modules: [
      {
        title: "Blockchain Fundamentals",
        content: "<h2>Understanding Distributed Ledger Technology</h2><p>Learn the core concepts behind blockchain and how it enables trustless systems.</p><h3>Topics Covered</h3><ul><li>Distributed Consensus</li><li>Cryptographic Hash Functions</li><li>Blocks and Chains</li><li>Public vs Private Blockchains</li></ul>",
        quiz: [
          {
            question: "What problem does the blockchain consensus mechanism solve?",
            options: ["Data storage efficiency", "Double-spending", "Network speed", "User authentication"],
            correctAnswer: 1
          },
          {
            question: "What is the primary characteristic of a cryptographic hash function?",
            options: ["Reversibility", "Determinism", "Variability", "Simplicity"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Smart Contracts and DApps",
        content: "<h2>Programmable Blockchain Applications</h2><p>Learn how to create and deploy smart contracts and build decentralized applications.</p><h3>Key Concepts</h3><ul><li>Ethereum and EVM</li><li>Solidity Programming</li><li>Web3.js Integration</li><li>DApp Architecture</li></ul>",
        quiz: [
          {
            question: "What language is primarily used to write Ethereum smart contracts?",
            options: ["JavaScript", "Python", "Solidity", "C++"],
            correctAnswer: 2
          },
          {
            question: "What is gas in the context of Ethereum?",
            options: ["A cryptocurrency", "A measure of computational effort", "A type of smart contract", "A blockchain explorer"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 175
  },
  {
    title: "Cybersecurity Fundamentals",
    description: "Learn essential cybersecurity concepts, threat detection, vulnerability assessment, and security best practices.",
    difficulty: "intermediate",
    subjects: ["Cybersecurity", "Computer Science", "Networking"],
    modules: [
      {
        title: "Security Principles and Threats",
        content: "<h2>Understanding the Security Landscape</h2><p>Learn about common security threats and fundamental principles of information security.</p><h3>Topics Covered</h3><ul><li>CIA Triad</li><li>Common Attack Vectors</li><li>Malware Types</li><li>Social Engineering</li></ul>",
        quiz: [
          {
            question: "What does the 'A' stand for in the CIA triad?",
            options: ["Authentication", "Authorization", "Availability", "Auditing"],
            correctAnswer: 2
          },
          {
            question: "Which of the following is NOT a type of malware?",
            options: ["Virus", "Worm", "Firewall", "Ransomware"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "Network Security",
        content: "<h2>Protecting Network Infrastructure</h2><p>Learn techniques and tools to secure networks against various threats.</p><h3>Key Concepts</h3><ul><li>Firewalls and IDS/IPS</li><li>VPNs and Encryption</li><li>Network Monitoring</li><li>Wireless Security</li></ul>",
        quiz: [
          {
            question: "What is the primary purpose of a firewall?",
            options: ["To detect viruses", "To control network traffic based on rules", "To encrypt data", "To monitor user activity"],
            correctAnswer: 1
          },
          {
            question: "Which encryption protocol is considered insecure for WiFi networks?",
            options: ["WPA3", "WPA2", "WEP", "EAP"],
            correctAnswer: 2
          }
        ]
      }
    ],
    enrollmentCount: 231
  },
  {
    title: "Artificial Intelligence Ethics",
    description: "Explore the ethical implications of AI technologies, including bias, privacy, transparency, and responsible AI development.",
    difficulty: "intermediate",
    subjects: ["AI", "Ethics", "Philosophy"],
    modules: [
      {
        title: "Ethical Frameworks for AI",
        content: "<h2>Philosophical Approaches to AI Ethics</h2><p>Understand different ethical frameworks for evaluating AI systems and their impacts.</p><h3>Topics Covered</h3><ul><li>Utilitarianism and AI</li><li>Deontological Ethics</li><li>Virtue Ethics</li><li>Justice and Fairness</li></ul>",
        quiz: [
          {
            question: "Which ethical framework focuses primarily on the outcomes or consequences of AI systems?",
            options: ["Deontological ethics", "Virtue ethics", "Utilitarianism", "Rights-based ethics"],
            correctAnswer: 2
          },
          {
            question: "What is algorithmic bias?",
            options: ["A programming error in AI algorithms", "The tendency of algorithms to favor certain outcomes", "A type of computer virus", "A method for optimizing AI performance"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Privacy and Transparency",
        content: "<h2>Balancing Innovation and Rights</h2><p>Explore the tension between AI advancement and protecting individual rights.</p><h3>Key Concepts</h3><ul><li>Data Privacy</li><li>Explainable AI</li><li>Informed Consent</li><li>Regulatory Approaches</li></ul>",
        quiz: [
          {
            question: "What does 'explainable AI' refer to?",
            options: ["AI that can explain human behavior", "AI systems whose decisions can be understood by humans", "AI that teaches other AI systems", "AI that explains technical concepts"],
            correctAnswer: 1
          },
          {
            question: "Which regulation established the 'right to be forgotten'?",
            options: ["HIPAA", "GDPR", "CCPA", "COPPA"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 142
  },
  {
    title: "Quantum Computing Fundamentals",
    description: "Introduction to quantum computing principles, quantum algorithms, and potential applications in cryptography and optimization.",
    difficulty: "advanced",
    subjects: ["Quantum Computing", "Computer Science", "Physics"],
    modules: [
      {
        title: "Quantum Mechanics for Computing",
        content: "<h2>Quantum Principles for Computation</h2><p>Learn the fundamental quantum mechanical principles that enable quantum computing.</p><h3>Topics Covered</h3><ul><li>Superposition</li><li>Entanglement</li><li>Quantum Measurement</li><li>Qubits vs Classical Bits</li></ul>",
        quiz: [
          {
            question: "What quantum property allows qubits to exist in multiple states simultaneously?",
            options: ["Entanglement", "Superposition", "Interference", "Decoherence"],
            correctAnswer: 1
          },
          {
            question: "What happens to a qubit's superposition state when measured?",
            options: ["It becomes entangled", "It collapses to a classical state", "It remains unchanged", "It splits into multiple qubits"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Quantum Algorithms",
        content: "<h2>Solving Problems with Quantum Computers</h2><p>Explore quantum algorithms that offer advantages over classical computing approaches.</p><h3>Key Algorithms</h3><ul><li>Shor's Algorithm</li><li>Grover's Algorithm</li><li>Quantum Fourier Transform</li><li>QAOA</li></ul>",
        quiz: [
          {
            question: "What problem does Shor's algorithm efficiently solve?",
            options: ["Sorting", "Database search", "Integer factorization", "Graph coloring"],
            correctAnswer: 2
          },
          {
            question: "What is the speedup provided by Grover's algorithm for unstructured search?",
            options: ["Linear", "Quadratic", "Exponential", "Logarithmic"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 98
  },
  {
    title: "Game Development with Unity",
    description: "Learn to create 2D and 3D games using the Unity game engine, C# programming, and game design principles.",
    difficulty: "intermediate",
    subjects: ["Game Development", "Computer Science", "Design"],
    modules: [
      {
        title: "Unity Fundamentals",
        content: "<h2>Getting Started with Unity</h2><p>Learn the core concepts of the Unity game engine and its interface.</p><h3>Topics Covered</h3><ul><li>Unity Interface</li><li>GameObjects and Components</li><li>Transforms and Hierarchy</li><li>Asset Management</li></ul>",
        quiz: [
          {
            question: "What is the basic building block of all entities in a Unity scene?",
            options: ["Asset", "Prefab", "GameObject", "Component"],
            correctAnswer: 2
          },
          {
            question: "Which component is automatically added to every GameObject in Unity?",
            options: ["Rigidbody", "Collider", "Transform", "Renderer"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "C# Programming for Games",
        content: "<h2>Scripting Game Behavior</h2><p>Learn how to use C# to create game mechanics and interactive elements.</p><h3>Key Concepts</h3><ul><li>MonoBehaviour Lifecycle</li><li>Input Handling</li><li>Physics Interactions</li><li>Coroutines</li></ul>",
        quiz: [
          {
            question: "Which method is called once per frame in Unity scripts?",
            options: ["Start()", "Awake()", "Update()", "OnEnable()"],
            correctAnswer: 2
          },
          {
            question: "What is a Coroutine in Unity?",
            options: ["A type of GameObject", "A function that can pause execution and resume later", "A physics component", "A type of collision detection"],
            correctAnswer: 1
          }
        ]
      }
    ],
    enrollmentCount: 267
  },
  {
    title: "Cloud Computing and AWS",
    description: "Master cloud computing concepts and learn to deploy, manage, and scale applications on Amazon Web Services (AWS).",
    difficulty: "intermediate",
    subjects: ["Cloud Computing", "DevOps", "Computer Science"],
    modules: [
      {
        title: "Cloud Computing Fundamentals",
        content: "<h2>Understanding Cloud Architecture</h2><p>Learn the core concepts of cloud computing and its service models.</p><h3>Topics Covered</h3><ul><li>IaaS, PaaS, and SaaS</li><li>Public vs Private Cloud</li><li>Cloud Benefits and Challenges</li><li>Cloud Security Basics</li></ul>",
        quiz: [
          {
            question: "Which cloud service model provides virtual machines and storage?",
            options: ["SaaS", "PaaS", "IaaS", "FaaS"],
            correctAnswer: 2
          },
          {
            question: "What is NOT typically a benefit of cloud computing?",
            options: ["Scalability", "Cost efficiency", "Physical hardware control", "Global reach"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "AWS Core Services",
        content: "<h2>Essential AWS Services</h2><p>Explore the fundamental services offered by Amazon Web Services.</p><h3>Key Services</h3><ul><li>EC2 and S3</li><li>VPC and Security Groups</li><li>RDS and DynamoDB</li><li>IAM and Security</li></ul>",
        quiz: [
          {
            question: "Which AWS service is used for object storage?",
            options: ["EC2", "S3", "RDS", "Lambda"],
            correctAnswer: 1
          },
          {
            question: "What is the purpose of AWS IAM?",
            options: ["To manage virtual machines", "To store data", "To control access to AWS resources", "To create virtual networks"],
            correctAnswer: 2
          }
        ]
      }
    ],
    enrollmentCount: 203
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // In a production environment, you would add authentication here
  // to ensure only admins can seed the database

  try {
    await connectDB();
    
    // Clear existing courses
    await Course.deleteMany({});
    
    // Insert sample courses
    await Course.insertMany(sampleCourses);
    
    res.status(200).json({ message: 'Database seeded successfully with sample courses!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: 'Error seeding database' });
  }
} 