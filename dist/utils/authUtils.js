"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Authenticate a user and get a JWT token
 * @param email User email
 * @param password User password
 * @param apiUrl Base API URL
 * @returns Login response with token and user data
 */
const authenticateUser = async (email, password, apiUrl) => {
    try {
        logger_1.default.info(`Authenticating user: ${email}`);
        const response = await axios_1.default.post(`${apiUrl}/auth/login`, {
            email,
            password
        });
        if (!response.data || !response.data.token) {
            throw new Error('Authentication failed: No token received');
        }
        logger_1.default.info('Authentication successful');
        return response.data;
    }
    catch (error) {
        logger_1.default.error('Authentication failed:', error.response?.data?.message || error.message);
        throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
    }
};
exports.authenticateUser = authenticateUser;
exports.default = {
    authenticateUser: exports.authenticateUser
};
//# sourceMappingURL=authUtils.js.map