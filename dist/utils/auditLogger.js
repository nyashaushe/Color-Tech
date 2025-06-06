"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
exports.getAuditLogsForRecord = getAuditLogsForRecord;
exports.getAuditLogsForUser = getAuditLogsForUser;
exports.getAuditLogs = getAuditLogs;
const db_1 = __importDefault(require("./db"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Create an audit log entry in the database
 */
async function createAuditLog(data) {
    try {
        const { user_id, action, table_name, record_id, old_values, new_values, ip_address, metadata } = data;
        const query = `
      INSERT INTO audit_logs (
        user_id, action, table_name, record_id, old_values, new_values, 
        ip_address, metadata, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW()
      )
    `;
        await db_1.default.query(query, [
            user_id,
            action,
            table_name,
            record_id,
            old_values ? JSON.stringify(old_values) : null,
            new_values ? JSON.stringify(new_values) : null,
            ip_address || null,
            metadata ? JSON.stringify(metadata) : null
        ]);
    }
    catch (error) {
        // Log the error but don't throw - audit logging should not break main functionality
        logger_1.default.error('Error creating audit log:', error);
        logger_1.default.error('Audit log data:', JSON.stringify(data));
    }
}
/**
 * Get audit logs for a specific record
 */
async function getAuditLogsForRecord(tableName, recordId, limit = 100, offset = 0) {
    try {
        const query = `
      SELECT al.*, u.first_name, u.last_name, u.email
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.table_name = $1 AND al.record_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3 OFFSET $4
    `;
        const { rows } = await db_1.default.query(query, [tableName, recordId, limit, offset]);
        return rows;
    }
    catch (error) {
        logger_1.default.error('Error getting audit logs for record:', error);
        throw error;
    }
}
/**
 * Get audit logs for a specific user
 */
async function getAuditLogsForUser(userId, limit = 100, offset = 0) {
    try {
        const query = `
      SELECT *
      FROM audit_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
        const { rows } = await db_1.default.query(query, [userId, limit, offset]);
        return rows;
    }
    catch (error) {
        logger_1.default.error('Error getting audit logs for user:', error);
        throw error;
    }
}
/**
 * Get all audit logs with optional filtering
 */
async function getAuditLogs(limit = 100, offset = 0, tableName, action, userId, startDate, endDate) {
    try {
        let query = `
      SELECT al.*, u.first_name, u.last_name, u.email
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
        const values = [];
        let paramIndex = 1;
        if (tableName) {
            query += ` AND al.table_name = $${paramIndex}`;
            values.push(tableName);
            paramIndex++;
        }
        if (action) {
            query += ` AND al.action = $${paramIndex}`;
            values.push(action);
            paramIndex++;
        }
        if (userId) {
            query += ` AND al.user_id = $${paramIndex}`;
            values.push(userId);
            paramIndex++;
        }
        if (startDate) {
            query += ` AND al.created_at >= $${paramIndex}`;
            values.push(startDate);
            paramIndex++;
        }
        if (endDate) {
            query += ` AND al.created_at <= $${paramIndex}`;
            values.push(endDate);
            paramIndex++;
        }
        query += `
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
        values.push(limit, offset);
        const { rows } = await db_1.default.query(query, values);
        return rows;
    }
    catch (error) {
        logger_1.default.error('Error getting audit logs:', error);
        throw error;
    }
}
exports.default = {
    createAuditLog,
    getAuditLogsForRecord,
    getAuditLogsForUser,
    getAuditLogs
};
//# sourceMappingURL=auditLogger.js.map