"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../utils/db"));
const logger_1 = __importDefault(require("../utils/logger"));
class BookingModel {
    /**
     * Create a new booking
     */
    async create(data) {
        try {
            const result = await db_1.default.query(`INSERT INTO bookings (user_id, vehicle_id, booking_date, start_time, end_time, status, total_price, notes)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
         RETURNING id`, [data.user_id, data.vehicle_id, data.booking_date, data.start_time, data.end_time, data.total_price, data.notes]);
            return result.rows[0].id;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.create:', error);
            throw error;
        }
    }
    /**
     * Find booking by ID with joined data
     */
    async findById(id) {
        try {
            const result = await db_1.default.query(`SELECT b.*, CONCAT(u.first_name, ' ', u.last_name) as client_name, 
                s.name as service_name, s.description as service_description
         FROM bookings b
         LEFT JOIN users u ON b.user_id = u.id
         LEFT JOIN booking_items bi ON b.id = bi.booking_id
         LEFT JOIN services s ON bi.service_id = s.id
         WHERE b.id = $1
         LIMIT 1`, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.findById:', error);
            throw error;
        }
    }
    /**
     * Find bookings by user ID
     */
    async findByUserId(userId, limit = 10, offset = 0, status) {
        try {
            let query = `
        SELECT b.*, v.make, v.model, v.license_plate,
               (SELECT STRING_AGG(s.name, ', ') 
                FROM booking_items bi 
                JOIN services s ON bi.service_id = s.id 
                WHERE bi.booking_id = b.id) as service_name
        FROM bookings b
        LEFT JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.user_id = $1`;
            const params = [userId];
            if (status) {
                query += ` AND b.status = $2`;
                params.push(status);
            }
            query += ` ORDER BY b.booking_date DESC, b.start_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);
            const result = await db_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.findByUserId:', error);
            throw error;
        }
    }
    /**
     * Count bookings by user ID
     */
    async countByUserId(userId, status) {
        try {
            let query = `SELECT COUNT(*) as count FROM bookings WHERE user_id = $1`;
            const params = [userId];
            if (status) {
                query += ` AND status = $2`;
                params.push(status);
            }
            const result = await db_1.default.query(query, params);
            return parseInt(result.rows[0].count);
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.countByUserId:', error);
            throw error;
        }
    }
    /**
     * Find all bookings with pagination and filtering
     */
    async findAll(limit = 10, offset = 0, filter) {
        try {
            let query = `
        SELECT b.*, 
               CONCAT(u.first_name, ' ', u.last_name) as client_name,
               v.make, v.model, v.license_plate,
               (SELECT STRING_AGG(s.name, ', ') 
                FROM booking_items bi 
                JOIN services s ON bi.service_id = s.id 
                WHERE bi.booking_id = b.id) as service_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN vehicles v ON b.vehicle_id = v.id
        WHERE 1=1`;
            const params = [];
            if (filter?.status) {
                params.push(filter.status);
                query += ` AND b.status = $${params.length}`;
            }
            if (filter?.date) {
                params.push(filter.date);
                query += ` AND b.booking_date = $${params.length}`;
            }
            if (filter?.staffId) {
                params.push(filter.staffId);
                query += ` AND b.staff_id = $${params.length}`;
            }
            query += ` ORDER BY b.booking_date DESC, b.start_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);
            const result = await db_1.default.query(query, params);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.findAll:', error);
            throw error;
        }
    }
    /**
     * Count all bookings with filtering
     */
    async countAll(filter) {
        try {
            let query = `SELECT COUNT(*) as count FROM bookings b WHERE 1=1`;
            const params = [];
            if (filter?.status) {
                params.push(filter.status);
                query += ` AND b.status = $${params.length}`;
            }
            if (filter?.date) {
                params.push(filter.date);
                query += ` AND b.booking_date = $${params.length}`;
            }
            if (filter?.staffId) {
                params.push(filter.staffId);
                query += ` AND b.staff_id = $${params.length}`;
            }
            const result = await db_1.default.query(query, params);
            return parseInt(result.rows[0].count);
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.countAll:', error);
            throw error;
        }
    }
    /**
     * Update booking
     */
    async update(id, data) {
        try {
            const updates = [];
            const values = [];
            let paramCounter = 1;
            if (data.booking_date !== undefined) {
                updates.push(`booking_date = $${paramCounter++}`);
                values.push(data.booking_date);
            }
            if (data.start_time !== undefined) {
                updates.push(`start_time = $${paramCounter++}`);
                values.push(data.start_time);
            }
            if (data.end_time !== undefined) {
                updates.push(`end_time = $${paramCounter++}`);
                values.push(data.end_time);
            }
            if (data.status !== undefined) {
                updates.push(`status = $${paramCounter++}`);
                values.push(data.status);
            }
            if (data.total_price !== undefined) {
                updates.push(`total_price = $${paramCounter++}`);
                values.push(data.total_price);
            }
            if (data.staff_id !== undefined) {
                updates.push(`staff_id = $${paramCounter++}`);
                values.push(data.staff_id);
            }
            if (data.notes !== undefined) {
                updates.push(`notes = $${paramCounter++}`);
                values.push(data.notes);
            }
            if (updates.length === 0) {
                return false;
            }
            updates.push(`updated_at = NOW()`);
            const query = `
        UPDATE bookings
        SET ${updates.join(', ')}
        WHERE id = $${paramCounter}
      `;
            values.push(id);
            const result = await db_1.default.query(query, values);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.update:', error);
            throw error;
        }
    }
    /**
     * Delete booking
     */
    async delete(id) {
        try {
            // First delete related booking items
            await db_1.default.query('DELETE FROM booking_items WHERE booking_id = $1', [id]);
            // Then delete the booking
            const result = await db_1.default.query('DELETE FROM bookings WHERE id = $1', [id]);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.delete:', error);
            throw error;
        }
    }
    /**
     * Add service to booking
     */
    async addService(bookingId, serviceId, quantity = 1, price) {
        try {
            const result = await db_1.default.query(`INSERT INTO booking_items (booking_id, service_id, quantity, price)
         VALUES ($1, $2, $3, $4)
         RETURNING id`, [bookingId, serviceId, quantity, price]);
            // Update the total price of the booking
            await this.updateBookingTotal(bookingId);
            return result.rows[0].id;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.addService:', error);
            throw error;
        }
    }
    /**
     * Remove service from booking
     */
    async removeService(bookingId, serviceId) {
        try {
            const result = await db_1.default.query('DELETE FROM booking_items WHERE booking_id = $1 AND service_id = $2', [bookingId, serviceId]);
            // Update the total price of the booking
            await this.updateBookingTotal(bookingId);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.removeService:', error);
            throw error;
        }
    }
    /**
     * Get services for a booking
     */
    async getBookingServices(bookingId) {
        try {
            const result = await db_1.default.query(`SELECT bi.*, s.name, s.description, s.duration_minutes
         FROM booking_items bi
         JOIN services s ON bi.service_id = s.id
         WHERE bi.booking_id = $1`, [bookingId]);
            return result.rows;
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.getBookingServices:', error);
            throw error;
        }
    }
    /**
     * Update booking total price based on services
     */
    async updateBookingTotal(bookingId) {
        try {
            await db_1.default.query(`UPDATE bookings
         SET total_price = (
           SELECT COALESCE(SUM(price * quantity), 0)
           FROM booking_items
           WHERE booking_id = $1
         )
         WHERE id = $1`, [bookingId]);
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.updateBookingTotal:', error);
            throw error;
        }
    }
    /**
     * Get booking statistics
     */
    async getStatistics(startDate, endDate) {
        try {
            const params = [];
            let dateFilter = '';
            if (startDate && endDate) {
                params.push(startDate, endDate);
                dateFilter = `WHERE booking_date BETWEEN $1 AND $2`;
            }
            // Get total bookings and status counts
            const totalQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
          COALESCE(SUM(total_price), 0) as total_revenue,
          COALESCE(AVG(total_price), 0) as avg_revenue
        FROM bookings
        ${dateFilter}
      `;
            const totalResult = await db_1.default.query(totalQuery, params);
            // Get bookings by date
            const dateQuery = `
        SELECT 
          booking_date::text as date, 
          COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY booking_date
        ORDER BY booking_date DESC
        LIMIT 30
      `;
            const dateResult = await db_1.default.query(dateQuery, params);
            return {
                total: parseInt(totalResult.rows[0].total),
                by_status: {
                    pending: parseInt(totalResult.rows[0].pending),
                    confirmed: parseInt(totalResult.rows[0].confirmed),
                    in_progress: parseInt(totalResult.rows[0].in_progress),
                    completed: parseInt(totalResult.rows[0].completed),
                    cancelled: parseInt(totalResult.rows[0].cancelled)
                },
                by_date: dateResult.rows.map((row) => ({
                    date: row.date,
                    count: parseInt(row.count)
                })),
                revenue: {
                    total: parseFloat(totalResult.rows[0].total_revenue),
                    average_per_booking: parseFloat(totalResult.rows[0].avg_revenue)
                }
            };
        }
        catch (error) {
            logger_1.default.error('Database error in BookingModel.getStatistics:', error);
            throw error;
        }
    }
}
exports.default = new BookingModel();
//# sourceMappingURL=Booking.js.map