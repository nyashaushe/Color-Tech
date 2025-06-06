"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const logger_1 = __importDefault(require("../utils/logger"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    /**
     * Find user by ID
     */
    async findById(id) {
        try {
            const query = `
        SELECT * FROM users
        WHERE id = $1
      `;
            const result = await db_1.default.query(query, [id]);
            if (result.rows && result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            logger_1.default.error(`Error finding user by ID: ${error}`);
            throw error;
        }
    }
    /**
     * Find user by email
     */
    async findByEmail(email) {
        try {
            const query = `
        SELECT * FROM users
        WHERE email = $1
      `;
            const result = await db_1.default.query(query, [email]);
            if (result.rows && result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            logger_1.default.error(`Error finding user by email: ${error}`);
            throw error;
        }
    }
    /**
     * Find all users with pagination
     */
    async findAll(limit = 10, offset = 0) {
        try {
            const query = `
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
            const result = await db_1.default.query(query, [limit, offset]);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error(`Error finding all users: ${error}`);
            throw error;
        }
    }
    /**
     * Count all users
     */
    async countAll() {
        try {
            const query = `
        SELECT COUNT(*) as count FROM users
      `;
            const result = await db_1.default.query(query);
            return parseInt(result.rows[0].count);
        }
        catch (error) {
            logger_1.default.error(`Error counting users: ${error}`);
            throw error;
        }
    }
    /**
     * Create a new user
     */
    async create(userData) {
        try {
            const { email, password, first_name, last_name, role, phone, is_active } = userData;
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const query = `
        INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id
      `;
            const result = await db_1.default.query(query, [
                email,
                hashedPassword,
                first_name,
                last_name,
                role,
                phone,
                is_active
            ]);
            return result.rows[0].id;
        }
        catch (error) {
            logger_1.default.error(`Error creating user: ${error}`);
            throw error;
        }
    }
    /**
     * Update user
     */
    async update(id, userData) {
        try {
            const updates = [];
            const values = [];
            let paramCounter = 1;
            if (userData.email !== undefined) {
                updates.push(`email = $${paramCounter++}`);
                values.push(userData.email);
            }
            if (userData.password !== undefined) {
                const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
                updates.push(`password = $${paramCounter++}`);
                values.push(hashedPassword);
            }
            if (userData.first_name !== undefined) {
                updates.push(`first_name = $${paramCounter++}`);
                values.push(userData.first_name);
            }
            if (userData.last_name !== undefined) {
                updates.push(`last_name = $${paramCounter++}`);
                values.push(userData.last_name);
            }
            if (userData.role !== undefined) {
                updates.push(`role = $${paramCounter++}`);
                values.push(userData.role);
            }
            if (userData.phone !== undefined) {
                updates.push(`phone = $${paramCounter++}`);
                values.push(userData.phone);
            }
            if (userData.is_active !== undefined) {
                updates.push(`is_active = $${paramCounter++}`);
                values.push(userData.is_active);
            }
            if (updates.length === 0) {
                return false;
            }
            const query = `
        UPDATE users
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCounter}
      `;
            values.push(id);
            const result = await db_1.default.query(query, values);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            logger_1.default.error(`Error updating user: ${error}`);
            throw error;
        }
    }
    /**
     * Delete user
     */
    async delete(id) {
        try {
            const query = `
        DELETE FROM users
        WHERE id = $1
      `;
            const result = await db_1.default.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            logger_1.default.error(`Error deleting user: ${error}`);
            throw error;
        }
    }
    /**
     * Update last login timestamp
     */
    async updateLastLogin(id) {
        try {
            const query = `
        UPDATE users
        SET last_login = NOW()
        WHERE id = $1
      `;
            const result = await db_1.default.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            logger_1.default.error(`Error updating last login: ${error}`);
            throw error;
        }
    }
}
exports.default = new UserModel();
//# sourceMappingURL=User.js.map