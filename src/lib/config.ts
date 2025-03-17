const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  nextauth: {
    url: process.env.NEXTAUTH_URL,
    secret: process.env.NEXTAUTH_SECRET,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

// Validate required environment variables
const validateConfig = () => {
  const required = [
    'MONGODB_URI',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
  ];

  required.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
};

// Call validation when importing the config
validateConfig();

export default config; 