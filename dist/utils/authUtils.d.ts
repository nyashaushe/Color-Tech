/**
 * Utility functions for authentication
 */
interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        first_name: string;
        last_name: string;
    };
}
/**
 * Authenticate a user and get a JWT token
 * @param email User email
 * @param password User password
 * @param apiUrl Base API URL
 * @returns Login response with token and user data
 */
export declare const authenticateUser: (email: string, password: string, apiUrl: string) => Promise<LoginResponse>;
declare const _default: {
    authenticateUser: (email: string, password: string, apiUrl: string) => Promise<LoginResponse>;
};
export default _default;
