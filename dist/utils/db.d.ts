import { PoolClient, QueryResult } from 'pg';
declare const db: {
    /**
     * Execute a query with parameters
     */
    query: (sql: string, params?: any[]) => Promise<QueryResult>;
    /**
     * Begin a transaction
     */
    beginTransaction: () => Promise<PoolClient>;
    /**
     * Commit a transaction
     */
    commit: (client: PoolClient) => Promise<void>;
    /**
     * Rollback a transaction
     */
    rollback: (client: PoolClient) => Promise<void>;
    /**
     * Close the pool
     */
    closePool: () => Promise<void>;
};
export default db;
