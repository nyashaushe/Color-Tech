/**
 * Client-side JWT configuration
 * This file contains JWT-related configuration for the client side
 */
export declare const jwtConfig: {
    /**
     * JWT token storage key in localStorage
     */
    storageKey: string;
    /**
     * Helper function to get the JWT token from localStorage
     */
    getToken: () => string | null;
    /**
     * Helper function to set the JWT token in localStorage
     */
    setToken: (token: string) => void;
    /**
     * Helper function to remove the JWT token from localStorage
     */
    removeToken: () => void;
    /**
     * Helper function to get the Authorization header with the JWT token
     */
    getAuthHeader: () => {
        Authorization: string;
    } | undefined;
};
export default jwtConfig;
