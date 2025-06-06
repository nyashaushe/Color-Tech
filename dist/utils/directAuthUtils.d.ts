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
 * Authenticate a user directly against the database
 * @param email User email
 * @param password User password
 * @returns Login response with token and user data
 */
export declare const authenticateUserDirect: (email: string, password: string) => Promise<LoginResponse>;
declare const _default: {
    authenticateUserDirect: (email: string, password: string) => Promise<LoginResponse>;
};
export default _default;
