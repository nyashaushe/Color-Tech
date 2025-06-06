"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
const jwt_1 = __importDefault(require("../config/jwt"));
/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication required. No token provided.' });
        }
        // Check if the authorization header has the correct format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Authentication failed. Token format is invalid.' });
        }
        const token = parts[1];
        // Verify the token using centralized JWT configuration
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.default.getSecret());
        // Attach the user info to the request
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Authentication failed. Token has expired.' });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
        }
        return res.status(500).json({ message: 'Internal server error during authentication.' });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to authorize requests based on user roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied. You do not have permission to access this resource.'
            });
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Optional authentication middleware - doesn't require authentication but will
 * attach user info to the request if a valid token is provided
 */
const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }
        // Check if the authorization header has the correct format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return next();
        }
        const token = parts[1];
        // Verify the token using centralized JWT configuration
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.default.getSecret());
        // Attach the user info to the request
        req.user = decoded;
        next();
    }
    catch (error) {
        // Just continue without authentication if token is invalid
        next();
    }
};
exports.optionalAuthenticate = optionalAuthenticate;
//# sourceMappingURL=auth.js.map