/**
 * Centralized JWT configuration
 * This file contains all JWT-related configuration to ensure consistency across the application
 */
export declare const jwtConfig: {
    /**
     * JWT secret key used for signing and verifying tokens
     * Falls back to a default value if environment variable is not set
     * IMPORTANT: Always set a strong secret in production environment
     */
    secret: string;
    /**
     * JWT token expiration time
     * Falls back to a default value if environment variable is not set
     */
    expiresIn: string;
    /**
     * Helper function to get the JWT secret
     * This ensures we always use the same secret throughout the application
     */
    getSecret: () => string;
    /**
     * Helper function to get the JWT expiration time
     * This ensures we always use the same expiration time throughout the application
     */
    getExpiresIn: () => string;
};
export default jwtConfig;
