"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const db_1 = __importDefault(require("../utils/db"));
const router = express_1.default.Router();
// Get all vehicles (admin only)
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const query = `
      SELECT v.*, u.first_name, u.last_name, u.email
      FROM vehicles v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const countQuery = `SELECT COUNT(*) FROM vehicles`;
        const result = await db_1.default.query(query, [limit, offset]);
        const countResult = await db_1.default.query(countQuery);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / Number(limit));
        return res.status(200).json({
            vehicles: result.rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: Number(page),
                itemsPerPage: Number(limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching vehicles:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
// Get user's vehicles
router.get('/my-vehicles', auth_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.id;
        const query = `
      SELECT * FROM vehicles
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
        const result = await db_1.default.query(query, [userId]);
        return res.status(200).json({ vehicles: result.rows });
    }
    catch (error) {
        console.error('Error fetching user vehicles:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
// Get vehicle by ID
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.role === 'admin';
        const query = `
      SELECT * FROM vehicles
      WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}
    `;
        const result = await db_1.default.query(query, isAdmin ? [id] : [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        return res.status(200).json({ vehicle: result.rows[0] });
    }
    catch (error) {
        console.error('Error fetching vehicle:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
// Create vehicle
router.post('/', auth_1.authenticate, (0, validation_1.validateRequiredFields)(['make', 'model', 'year']), async (req, res) => {
    try {
        const { make, model, year, color, license_plate, vin, notes } = req.body;
        const userId = req.user?.id;
        const query = `
        INSERT INTO vehicles (
          user_id, make, model, year, color, license_plate, vin, notes, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *
      `;
        const result = await db_1.default.query(query, [
            userId, make, model, year, color, license_plate, vin, notes
        ]);
        return res.status(201).json({
            message: 'Vehicle created successfully',
            vehicle: result.rows[0]
        });
    }
    catch (error) {
        console.error('Error creating vehicle:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
// Update vehicle
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.role === 'admin';
        const { make, model, year, color, license_plate, vin, notes } = req.body;
        // Check if vehicle exists and belongs to user
        const checkQuery = `
        SELECT * FROM vehicles
        WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}
      `;
        const checkResult = await db_1.default.query(checkQuery, isAdmin ? [id] : [id, userId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        // Build update query
        const updates = [];
        const values = [];
        let paramCounter = 1;
        if (make !== undefined) {
            updates.push(`make = $${paramCounter++}`);
            values.push(make);
        }
        if (model !== undefined) {
            updates.push(`model = $${paramCounter++}`);
            values.push(model);
        }
        if (year !== undefined) {
            updates.push(`year = $${paramCounter++}`);
            values.push(year);
        }
        if (color !== undefined) {
            updates.push(`color = $${paramCounter++}`);
            values.push(color);
        }
        if (license_plate !== undefined) {
            updates.push(`license_plate = $${paramCounter++}`);
            values.push(license_plate);
        }
        if (vin !== undefined) {
            updates.push(`vin = $${paramCounter++}`);
            values.push(vin);
        }
        if (notes !== undefined) {
            updates.push(`notes = $${paramCounter++}`);
            values.push(notes);
        }
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        const updateQuery = `
        UPDATE vehicles
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCounter++}
        RETURNING *
      `;
        values.push(id);
        const updateResult = await db_1.default.query(updateQuery, values);
        return res.status(200).json({
            message: 'Vehicle updated successfully',
            vehicle: updateResult.rows[0]
        });
    }
    catch (error) {
        console.error('Error updating vehicle:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
// Delete vehicle
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.role === 'admin';
        // Check if vehicle exists and belongs to user
        const checkQuery = `
        SELECT * FROM vehicles
        WHERE id = $1 ${!isAdmin ? 'AND user_id = $2' : ''}
      `;
        const checkResult = await db_1.default.query(checkQuery, isAdmin ? [id] : [id, userId]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        // Delete vehicle
        const deleteQuery = `
        DELETE FROM vehicles
        WHERE id = $1
        RETURNING id
      `;
        await db_1.default.query(deleteQuery, [id]);
        return res.status(200).json({
            message: 'Vehicle deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting vehicle:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=vehicles.js.map