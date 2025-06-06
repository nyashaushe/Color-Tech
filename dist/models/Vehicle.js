"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const logger_1 = __importDefault(require("../utils/logger"));
class VehicleModel {
    /**
     * Find all vehicles with pagination
     */
    async findAll(limit, offset) {
        try {
            const query = `
        SELECT * FROM vehicles
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
            const result = await db_1.default.query(query, [limit, offset]);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.findAll:', error);
            throw error;
        }
    }
    /**
     * Count total vehicles for pagination
     */
    async countVehicles() {
        try {
            const query = 'SELECT COUNT(*) AS count FROM vehicles';
            const [rows] = await db_1.default.query(query);
            return parseInt(rows[0].count);
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.countVehicles:', error);
            throw error;
        }
    }
    /**
     * Find vehicles by user ID with pagination
     */
    async findByUserId(userId, limit, offset) {
        try {
            const query = `
        SELECT * FROM vehicles
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
            const result = await db_1.default.query(query, [userId, limit, offset]);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.findByUserId:', error);
            throw error;
        }
    }
    /**
     * Count vehicles by user ID for pagination
     */
    async countByUserId(userId) {
        try {
            const query = 'SELECT COUNT(*) AS count FROM vehicles WHERE user_id = $1';
            const [rows] = await db_1.default.query(query, [userId]);
            return parseInt(rows[0].count);
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.countByUserId:', error);
            throw error;
        }
    }
    /**
     * Find vehicle by ID
     */
    async findById(id) {
        try {
            const query = 'SELECT * FROM vehicles WHERE id = $1';
            const result = await db_1.default.query(query, [id]);
            return result.rows.length ? result.rows[0] : null;
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.findById:', error);
            throw error;
        }
    }
    /**
     * Create a new vehicle
     */
    async create(vehicleData) {
        try {
            const { user_id, make, model, year, color, license_plate, vin, notes } = vehicleData;
            const query = `
        INSERT INTO vehicles (
          user_id, make, model, year, color, license_plate, vin, notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
        )
        RETURNING id
      `;
            const params = [user_id, make, model, year, color, license_plate, vin, notes];
            const result = await db_1.default.query(query, params);
            const id = result.rows[0].id;
            return this.findById(id);
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.create:', error);
            throw error;
        }
    }
    /**
     * Update a vehicle
     */
    async update(id, vehicleData) {
        try {
            // First check if vehicle exists
            const vehicle = await this.findById(id);
            if (!vehicle) {
                return null;
            }
            // Build the SET clause dynamically based on provided fields
            const updates = [];
            const params = [];
            // Add each field that needs to be updated
            Object.entries(vehicleData).forEach(([key, value]) => {
                if (value !== undefined) {
                    updates.push(`${key} = $${params.length + 1}`);
                    params.push(value);
                }
            });
            // Add updated_at
            updates.push(`updated_at = NOW()`);
            // Add the ID as the last parameter
            params.push(id);
            const query = `
        UPDATE vehicles
        SET ${updates.join(', ')}
        WHERE id = $${params.length}
        RETURNING *
      `;
            const result = await db_1.default.query(query, params);
            return this.findById(id);
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.update:', error);
            throw error;
        }
    }
    /**
     * Delete a vehicle
     */
    async delete(id) {
        try {
            // Check if vehicle is used in any bookings
            const checkQuery = `
        SELECT COUNT(*) AS count FROM bookings WHERE vehicle_id = $1
      `;
            const checkResult = await db_1.default.query(checkQuery, [id]);
            if (parseInt(checkResult.rows[0].count) > 0) {
                // Vehicle is in use, cannot delete
                return false;
            }
            const query = 'DELETE FROM vehicles WHERE id = $1 RETURNING id';
            const result = await db_1.default.query(query, [id]);
            return result.rows.length > 0;
        }
        catch (error) {
            logger_1.default.error('Database error in VehicleModel.delete:', error);
            throw error;
        }
    }
}
exports.default = new VehicleModel();
//# sourceMappingURL=Vehicle.js.map