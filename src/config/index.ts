import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Frontend-compatible configuration
export const config = {
  // API configuration
  apiUrl: process.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // JWT configuration
  jwt: {
    secret: process.env.VITE_JWT_SECRET || 'please_set_a_strong_jwt_secret_in_env_file',
    expiresIn: '24h',
  },
  
  // Server configuration (for reference only in frontend)
  server: {
    port: process.env.VITE_PORT || 3000,
    env: process.env.VITE_NODE_ENV || 'development',
  },
  
  // Database configuration (for reference only in frontend)
  db: {
    host: process.env.VITE_DB_HOST || 'localhost',
    user: process.env.VITE_DB_USER || 'postgres',
    password: process.env.VITE_DB_PASSWORD || '',
    database: process.env.VITE_DB_NAME || 'color_tech_db',
    port: 5432,
  },
};

export default config; 