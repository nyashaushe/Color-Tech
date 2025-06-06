"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config");
const logger_1 = __importDefault(require("./logger"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Create a connection pool
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || config_1.config.db.host,
    user: process.env.DB_USER || config_1.config.db.user,
    password: process.env.DB_PASSWORD || config_1.config.db.password,
    database: process.env.DB_NAME || config_1.config.db.database,
    port: parseInt(process.env.DB_PORT || '5432'),
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000 // How long a client is allowed to remain idle before being closed
});
// Test the connection
pool.connect()
    .then((client) => {
    logger_1.default.info('Database connection established successfully');
    client.release();
})
    .catch((err) => {
    logger_1.default.error(`Error connecting to database: ${err.message}`);
});
// Database utility functions
const db = {
    /**
     * Execute a query with parameters
     */
    query: async (sql, params = []) => {
        try {
            const result = await pool.query(sql, params);
            return result;
        }
        catch (error) {
            logger_1.default.error(`Database query error: ${error}`);
            throw error;
        }
    },
    /**
     * Begin a transaction
     */
    beginTransaction: async () => {
        const client = await pool.connect();
        await client.query('BEGIN');
        return client;
    },
    /**
     * Commit a transaction
     */
    commit: async (client) => {
        await client.query('COMMIT');
        client.release();
    },
    /**
     * Rollback a transaction
     */
    rollback: async (client) => {
        await client.query('ROLLBACK');
        client.release();
    },
    /**
     * Close the pool
     */
    closePool: async () => {
        try {
            await pool.end();
            logger_1.default.info('Database pool closed successfully');
        }
        catch (error) {
            logger_1.default.error(`Error closing database pool: ${error}`);
        }
    }
};
exports.default = db;
//# sourceMappingURL=db.js.map