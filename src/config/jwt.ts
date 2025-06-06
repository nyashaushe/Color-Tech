import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Centralized JWT configuration
 * This file contains all JWT-related configuration to ensure consistency across the application
 */
export const jwtConfig = {
  /**
   * JWT secret key used for signing and verifying tokens
   * Falls back to a default value if environment variable is not set
   * IMPORTANT: Always set a strong secret in production environment
   */
  secret: process.env.JWT_SECRET || 'please_set_a_strong_jwt_secret_in_env_file',
  
  /**
   * JWT token expiration time
   * Falls back to a default value if environment variable is not set
   */
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  /**
   * Helper function to get the JWT secret
   * This ensures we always use the same secret throughout the application
   */
  getSecret: (): string => jwtConfig.secret,
  
  /**
   * Helper function to get the JWT expiration time
   * This ensures we always use the same expiration time throughout the application
   */
  getExpiresIn: (): string => jwtConfig.expiresIn
};

export default jwtConfig; 