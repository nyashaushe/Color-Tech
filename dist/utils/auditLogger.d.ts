export interface AuditLogData {
    user_id: number;
    action: 'insert' | 'update' | 'delete' | 'login' | 'logout' | 'view';
    table_name: string;
    record_id: number;
    old_values?: any;
    new_values?: any;
    ip_address?: string;
    metadata?: any;
}
/**
 * Create an audit log entry in the database
 */
export declare function createAuditLog(data: AuditLogData): Promise<void>;
/**
 * Get audit logs for a specific record
 */
export declare function getAuditLogsForRecord(tableName: string, recordId: number, limit?: number, offset?: number): Promise<any[]>;
/**
 * Get audit logs for a specific user
 */
export declare function getAuditLogsForUser(userId: number, limit?: number, offset?: number): Promise<any[]>;
/**
 * Get all audit logs with optional filtering
 */
export declare function getAuditLogs(limit?: number, offset?: number, tableName?: string, action?: string, userId?: number, startDate?: Date, endDate?: Date): Promise<any[]>;
declare const _default: {
    createAuditLog: typeof createAuditLog;
    getAuditLogsForRecord: typeof getAuditLogsForRecord;
    getAuditLogsForUser: typeof getAuditLogsForUser;
    getAuditLogs: typeof getAuditLogs;
};
export default _default;
