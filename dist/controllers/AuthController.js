"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = __importDefault(require("../utils/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = __importDefault(require("../config/jwt"));
const logger_1 = __importDefault(require("../utils/logger"));
// Helper function to verify password
async function verifyPassword(user, password) {
    return bcryptjs_1.default.compare(password, user.password);
}
// Helper function to generate JWT token
function generateToken(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    // Use centralized JWT configuration
    return jsonwebtoken_1.default.sign(payload, jwt_1.default.getSecret(), { expiresIn: jwt_1.default.getExpiresIn() });
}
class AuthController {
    async register(req, res) {
        try {
            const { email, password, first_name, last_name, phone } = req.body;
            // Check if user already exists
            const existingUser = await User_1.default.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            // Create new user
            const userId = await User_1.default.create({
                email,
                password,
                first_name,
                last_name,
                role: 'client', // Default role for registration
                phone,
                is_active: true // Add the missing is_active field
            });
            // Get the created user
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(500).json({ message: 'Failed to create user' });
            }
            // Generate JWT token
            const token = generateToken(user);
            // Record session
            await db_1.default.query(`INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
         VALUES ($1, $2, NOW() + INTERVAL '${jwt_1.default.getExpiresIn()}', $3, $4)`, [user.id, token, req.ip, req.headers['user-agent']]);
            return res.status(201).json({
                message: 'User registered successfully',
                user,
                token
            });
        }
        catch (error) {
            logger_1.default.error('Registration error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user by email
            const user = await User_1.default.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Verify password
            const isPasswordValid = await verifyPassword(user, password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Update last login timestamp
            await User_1.default.updateLastLogin(user.id);
            // Generate JWT token
            const token = generateToken(user);
            // Record login session
            await db_1.default.query(`INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
         VALUES ($1, $2, NOW() + INTERVAL '${jwt_1.default.getExpiresIn()}', $3, $4)`, [user.id, token, req.ip, req.headers['user-agent']]);
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                },
                token
            });
        }
        catch (error) {
            logger_1.default.error('Login error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                // Invalidate the token in the database
                await db_1.default.query('UPDATE user_sessions SET expires_at = NOW() WHERE token = $1', [token]);
            }
            return res.status(200).json({ message: 'Logout successful' });
        }
        catch (error) {
            logger_1.default.error('Logout error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async getProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const user = await User_1.default.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ user });
        }
        catch (error) {
            logger_1.default.error('Get profile error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const { first_name, last_name, phone, password } = req.body;
            const updatedUser = await User_1.default.update(req.user.id, {
                first_name,
                last_name,
                phone,
                password
            });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        }
        catch (error) {
            logger_1.default.error('Update profile error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map