"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUserDirect = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./db"));
const logger_1 = __importDefault(require("./logger"));
const jwt_1 = __importDefault(require("../config/jwt"));
/**
 * Authenticate a user directly against the database
 * @param email User email
 * @param password User password
 * @returns Login response with token and user data
 */
const authenticateUserDirect = async (email, password) => {
    try {
        logger_1.default.info(`Directly authenticating user: ${email}`);
        // Find user by email
        const result = await db_1.default.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
        if (!result.rows || result.rows.length === 0) {
            throw new Error('Invalid credentials');
        }
        const user = result.rows[0];
        // Verify password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Generate JWT token
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        // Get the secret and expiration time
        const secret = jwt_1.default.getSecret();
        const expiresIn = jwt_1.default.getExpiresIn();
        // Sign the token using any to bypass type checking
        // This is a workaround for the type issues with jsonwebtoken
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
        logger_1.default.info('Authentication successful');
        // Return login response
        return {
            token,
            user: {
                id: user.id.toString(),
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        };
    }
    catch (error) {
        logger_1.default.error('Authentication failed:', error.message);
        throw new Error(`Authentication failed: ${error.message}`);
    }
};
exports.authenticateUserDirect = authenticateUserDirect;
exports.default = {
    authenticateUserDirect: exports.authenticateUserDirect
};
//# sourceMappingURL=directAuthUtils.js.map