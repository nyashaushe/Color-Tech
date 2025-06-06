"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const logger_1 = __importDefault(require("../utils/logger"));
class ServiceModel {
    /**
     * Find all services with pagination and optional filtering
     */
    async findAll(limit, offset, categoryId, isActive) {
        try {
            let query = `
        SELECT s.*, sc.name as category_name
        FROM services s
        JOIN service_categories sc ON s.category_id = sc.id
        WHERE 1=1
      `;
            const params = [];
            if (categoryId !== undefined) {
                params.push(categoryId);
                query += ` AND s.category_id = $${params.length}`;
            }
            if (isActive !== undefined) {
                params.push(isActive);
                query += ` AND s.is_active = $${params.length}`;
            }
            query += ` ORDER BY s.name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);
            const result = await db_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.findAll:', error);
            throw error;
        }
    }
    /**
     * Count services with optional filtering
     */
    async countServices(categoryId, isActive) {
        try {
            let query = `
        SELECT COUNT(*) as count
        FROM services
        WHERE 1=1
      `;
            const params = [];
            if (categoryId !== undefined) {
                params.push(categoryId);
                query += ` AND category_id = $${params.length}`;
            }
            if (isActive !== undefined) {
                params.push(isActive);
                query += ` AND is_active = $${params.length}`;
            }
            const result = await db_1.default.query(query, params);
            return parseInt(result.rows[0].count);
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.countServices:', error);
            throw error;
        }
    }
    /**
     * Find service by ID
     */
    async findById(id) {
        try {
            const query = `
        SELECT s.*, sc.name as category_name
        FROM services s
        JOIN service_categories sc ON s.category_id = sc.id
        WHERE s.id = $1
      `;
            const result = await db_1.default.query(query, [id]);
            return result.rows.length ? result.rows[0] : null;
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.findById:', error);
            throw error;
        }
    }
    /**
     * Create a new service
     */
    async create(serviceData) {
        try {
            const { name, description, price, duration_minutes, category_id, is_active = true } = serviceData;
            const query = `
        INSERT INTO services (
          name, description, price, duration_minutes, category_id, is_active, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, NOW(), NOW()
        )
        RETURNING id
      `;
            const result = await db_1.default.query(query, [name, description, price, duration_minutes, category_id, is_active]);
            const id = result.rows[0].id;
            return this.findById(id);
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.create:', error);
            throw error;
        }
    }
    /**
     * Update a service
     */
    async update(id, serviceData) {
        try {
            // First check if service exists
            const service = await this.findById(id);
            if (!service) {
                return null;
            }
            // Build the SET clause dynamically based on provided fields
            const updates = [];
            const params = [];
            // Add each field that needs to be updated
            Object.entries(serviceData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updates.push(`${key} = $${params.length + 1}`);
                    params.push(value);
                }
            });
            // Add updated_at
            updates.push(`updated_at = NOW()`);
            // If no updates, return the service without changes
            if (updates.length === 0) {
                return service;
            }
            // Add the ID as the last parameter
            params.push(id);
            const query = `
        UPDATE services
        SET ${updates.join(', ')}
        WHERE id = $${params.length}
        RETURNING *
      `;
            await db_1.default.query(query, params);
            return this.findById(id);
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.update:', error);
            throw error;
        }
    }
    /**
     * Delete a service
     */
    async delete(id) {
        try {
            // Check if service is used in any bookings
            const checkQuery = `
        SELECT COUNT(*) as count 
        FROM booking_items 
        WHERE service_id = $1
      `;
            const checkResult = await db_1.default.query(checkQuery, [id]);
            if (parseInt(checkResult.rows[0].count) > 0) {
                // Service is in use, cannot delete
                return false;
            }
            const query = 'DELETE FROM services WHERE id = $1 RETURNING id';
            const result = await db_1.default.query(query, [id]);
            return result.rows.length > 0;
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.delete:', error);
            throw error;
        }
    }
    /**
     * Get all service categories
     */
    async getCategories() {
        try {
            const query = `
        SELECT * FROM service_categories
        ORDER BY name
      `;
            const result = await db_1.default.query(query);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.getCategories:', error);
            throw error;
        }
    }
    /**
     * Find category by ID
     */
    async findCategoryById(id) {
        try {
            const query = 'SELECT * FROM service_categories WHERE id = $1';
            const result = await db_1.default.query(query, [id]);
            return result.rows.length ? result.rows[0] : null;
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.findCategoryById:', error);
            throw error;
        }
    }
    /**
     * Create a new service category
     */
    async createCategory(categoryData) {
        try {
            const { name, description } = categoryData;
            const query = `
        INSERT INTO service_categories (name, description, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id
      `;
            const result = await db_1.default.query(query, [name, description]);
            const id = result.rows[0].id;
            return this.findCategoryById(id);
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.createCategory:', error);
            throw error;
        }
    }
    /**
     * Update a service category
     */
    async updateCategory(id, categoryData) {
        try {
            // First check if category exists
            const category = await this.findCategoryById(id);
            if (!category) {
                return null;
            }
            // Build the SET clause dynamically based on provided fields
            const updates = [];
            const params = [];
            // Add each field that needs to be updated
            Object.entries(categoryData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updates.push(`${key} = $${params.length + 1}`);
                    params.push(value);
                }
            });
            // Add updated_at
            updates.push(`updated_at = NOW()`);
            // If no updates, return the category without changes
            if (updates.length === 0) {
                return category;
            }
            // Add the ID as the last parameter
            params.push(id);
            const query = `
        UPDATE service_categories
        SET ${updates.join(', ')}
        WHERE id = $${params.length}
        RETURNING *
      `;
            await db_1.default.query(query, params);
            return this.findCategoryById(id);
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.updateCategory:', error);
            throw error;
        }
    }
    /**
     * Delete a service category
     */
    async deleteCategory(id) {
        try {
            // Check if category is used in any services
            const checkQuery = `
        SELECT COUNT(*) as count 
        FROM services 
        WHERE category_id = $1
      `;
            const checkResult = await db_1.default.query(checkQuery, [id]);
            if (parseInt(checkResult.rows[0].count) > 0) {
                // Category is in use, cannot delete
                return false;
            }
            const query = 'DELETE FROM service_categories WHERE id = $1 RETURNING id';
            const result = await db_1.default.query(query, [id]);
            return result.rows.length > 0;
        }
        catch (error) {
            logger_1.default.error('Database error in ServiceModel.deleteCategory:', error);
            throw error;
        }
    }
}
exports.default = new ServiceModel();
//# sourceMappingURL=Service.js.map