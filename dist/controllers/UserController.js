"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("../utils/errorHandler");
const pagination_1 = require("../middleware/pagination");
const logger_1 = __importDefault(require("../utils/logger"));
const auditLogger_1 = require("../utils/auditLogger");
const jwt_1 = __importDefault(require("../config/jwt"));
class UserController {
    /**
     * Register a new user
     */
    async register(req, res) {
        try {
            const { email, password, full_name, role, phone } = req.body;
            // Check if user already exists
            const existingUser = await User_1.default.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'User with this email already exists' });
            }
            // Hash password
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(password, salt);
            // Create user
            const userId = await User_1.default.create({
                email,
                password: hashedPassword,
                full_name,
                role: role || 'client', // Default role is client
                phone: phone || null,
                is_active: true
            });
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: req.user?.id || null,
                action: 'create',
                table_name: 'users',
                record_id: userId,
                old_values: null,
                new_values: { email, full_name, role: role || 'client', phone: phone || null },
                ip_address: req.ip,
                metadata: { admin_action: req.user?.role === 'admin' }
            });
            logger_1.default.info(`New user registered: ${email}`);
            return res.status(201).json({
                message: 'User registered successfully',
                user_id: userId
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error registering user');
        }
    }
    /**
     * Login user
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Find user by email
            const user = await User_1.default.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Check if user is active
            if (!user.is_active) {
                return res.status(403).json({ message: 'Account is deactivated' });
            }
            // Verify password
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            // Generate JWT token using centralized JWT configuration
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, jwt_1.default.getSecret(), { expiresIn: jwt_1.default.getExpiresIn() });
            // Update last login timestamp
            await User_1.default.updateLastLogin(user.id);
            logger_1.default.info(`User logged in: ${email}`);
            return res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error logging in');
        }
    }
    /**
     * Get user profile
     */
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Remove sensitive information
            const { password, ...userProfile } = user;
            return res.status(200).json(userProfile);
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error fetching user profile');
        }
    }
    /**
     * Update user profile
     */
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { full_name, phone, password } = req.body;
            // Get current user data for audit log
            const currentUser = await User_1.default.findById(userId);
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Prepare update data
            const updateData = {};
            if (full_name)
                updateData.full_name = full_name;
            if (phone !== undefined)
                updateData.phone = phone;
            // Hash new password if provided
            if (password) {
                const salt = await bcrypt_1.default.genSalt(10);
                updateData.password = await bcrypt_1.default.hash(password, salt);
            }
            // Update user
            await User_1.default.update(userId, updateData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'users',
                record_id: userId,
                old_values: { full_name: currentUser.full_name, phone: currentUser.phone },
                new_values: { full_name: full_name || currentUser.full_name, phone: phone !== undefined ? phone : currentUser.phone },
                ip_address: req.ip,
                metadata: { password_changed: !!password }
            });
            logger_1.default.info(`User profile updated: ${currentUser.email}`);
            return res.status(200).json({
                message: 'Profile updated successfully'
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error updating user profile');
        }
    }
    /**
     * Get all users (admin only)
     */
    async getAllUsers(req, res) {
        try {
            // Apply pagination
            const { page, limit, offset } = (0, pagination_1.paginationMiddleware)(req);
            // Get users with pagination
            const users = await User_1.default.findAll(limit, offset);
            const total = await User_1.default.countAll();
            // Remove sensitive information
            const sanitizedUsers = users.map(user => {
                const { password, ...userData } = user;
                return userData;
            });
            return res.status(200).json({
                users: sanitizedUsers,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error fetching users');
        }
    }
    /**
     * Get user by ID (admin only)
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User_1.default.findById(parseInt(id));
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Remove sensitive information
            const { password, ...userData } = user;
            return res.status(200).json(userData);
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error fetching user');
        }
    }
    /**
     * Update user (admin only)
     */
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id);
            const { full_name, email, role, phone, is_active } = req.body;
            // Get current user data for audit log
            const currentUser = await User_1.default.findById(userId);
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Prepare update data
            const updateData = {};
            if (full_name)
                updateData.full_name = full_name;
            if (email)
                updateData.email = email;
            if (role)
                updateData.role = role;
            if (phone !== undefined)
                updateData.phone = phone;
            if (is_active !== undefined)
                updateData.is_active = is_active;
            // Update user
            await User_1.default.update(userId, updateData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: req.user?.id || null,
                action: 'update',
                table_name: 'users',
                record_id: userId,
                old_values: {
                    full_name: currentUser.full_name,
                    email: currentUser.email,
                    role: currentUser.role,
                    phone: currentUser.phone,
                    is_active: currentUser.is_active
                },
                new_values: {
                    full_name: full_name || currentUser.full_name,
                    email: email || currentUser.email,
                    role: role || currentUser.role,
                    phone: phone !== undefined ? phone : currentUser.phone,
                    is_active: is_active !== undefined ? is_active : currentUser.is_active
                },
                ip_address: req.ip,
                metadata: { admin_action: true }
            });
            logger_1.default.info(`User updated by admin: ${currentUser.email}`);
            return res.status(200).json({
                message: 'User updated successfully'
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error updating user');
        }
    }
    /**
     * Delete user (admin only)
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id);
            // Get user data for audit log
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Delete user
            await User_1.default.delete(userId);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: req.user?.id || null,
                action: 'delete',
                table_name: 'users',
                record_id: userId,
                old_values: {
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                },
                new_values: null,
                ip_address: req.ip,
                metadata: { admin_action: true }
            });
            logger_1.default.info(`User deleted by admin: ${user.email}`);
            return res.status(200).json({
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error deleting user');
        }
    }
    /**
     * Change user password
     */
    async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { current_password, new_password } = req.body;
            // Validate request
            if (!current_password || !new_password) {
                return res.status(400).json({ message: 'Current password and new password are required' });
            }
            // Get user
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Verify current password
            const isPasswordValid = await bcrypt_1.default.compare(current_password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            // Hash new password
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(new_password, salt);
            // Update password
            await User_1.default.update(userId, { password: hashedPassword });
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'users',
                record_id: userId,
                old_values: null,
                new_values: null,
                ip_address: req.ip,
                metadata: { password_changed: true }
            });
            logger_1.default.info(`Password changed for user: ${user.email}`);
            return res.status(200).json({
                message: 'Password changed successfully'
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error changing password');
        }
    }
    /**
     * Reset user password (admin only)
     */
    async resetPassword(req, res) {
        try {
            const { id } = req.params;
            const userId = parseInt(id);
            const { new_password } = req.body;
            // Validate request
            if (!new_password) {
                return res.status(400).json({ message: 'New password is required' });
            }
            // Get user
            const user = await User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Hash new password
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(new_password, salt);
            // Update password
            await User_1.default.update(userId, { password: hashedPassword });
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: req.user?.id || null,
                action: 'update',
                table_name: 'users',
                record_id: userId,
                old_values: null,
                new_values: null,
                ip_address: req.ip,
                metadata: { password_reset: true, admin_action: true }
            });
            logger_1.default.info(`Password reset by admin for user: ${user.email}`);
            return res.status(200).json({
                message: 'Password reset successfully'
            });
        }
        catch (error) {
            return (0, errorHandler_1.handleServerError)(res, error, 'Error resetting password');
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map