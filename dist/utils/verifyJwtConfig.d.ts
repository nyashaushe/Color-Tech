export interface VerificationResult {
    success: boolean;
    message: string;
}
/**
 * Utility to verify JWT configuration
 * This checks if the JWT secret is properly configured
 */
export declare const verifyJwtConfig: () => VerificationResult;
export default verifyJwtConfig;
