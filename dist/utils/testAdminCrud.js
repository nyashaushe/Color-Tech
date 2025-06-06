"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdminCrud = void 0;
const db_1 = __importDefault(require("./db"));
const logger_1 = __importDefault(require("./logger"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Utility to test admin CRUD operations directly against the database
 * This can be run manually to verify that admin operations are working correctly
 */
const testAdminCrud = async (baseUrl, adminToken) => {
    try {
        logger_1.default.info('Starting Admin CRUD operations test (direct database mode)...');
        // Test results
        const results = {
            read: { success: false, message: '' },
            create: { success: false, message: '' },
            update: { success: false, message: '' },
            delete: { success: false, message: '' }
        };
        // 1. Test READ operation - Get users
        try {
            logger_1.default.info('Testing READ operation - Get users');
            const result = await db_1.default.query('SELECT * FROM users');
            results.read.success = result.rows && result.rows.length >= 0;
            results.read.message = `Successfully retrieved ${result.rows.length} users`;
            logger_1.default.info(`READ operation result: ${results.read.success ? 'SUCCESS' : 'FAILED'}`);
        }
        catch (error) {
            results.read.message = `Error: ${error.message}`;
            logger_1.default.error(`READ operation failed: ${results.read.message}`);
        }
        // 2. Test CREATE operation - Create a test user
        try {
            logger_1.default.info('Testing CREATE operation - Create test user');
            // Generate a unique email
            const testEmail = `test-${Date.now()}@example.com`;
            const testPassword = 'Test123!';
            const testFirstName = 'Test';
            const testLastName = 'User';
            const testRole = 'client';
            // Hash the password
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(testPassword, salt);
            // Insert the test user
            const createResult = await db_1.default.query(`INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`, [testEmail, hashedPassword, testFirstName, testLastName, testRole, true]);
            const userId = createResult.rows[0].id;
            results.create.success = !!userId;
            results.create.message = `Successfully created user with ID: ${userId}`;
            logger_1.default.info(`CREATE operation result: ${results.create.success ? 'SUCCESS' : 'FAILED'}`);
            // If create succeeded, test UPDATE and DELETE
            if (results.create.success && userId) {
                // 3. Test UPDATE operation
                try {
                    logger_1.default.info(`Testing UPDATE operation - Update user ${userId}`);
                    const updatedFirstName = 'Updated';
                    const updatedLastName = 'TestUser';
                    const updateResult = await db_1.default.query(`UPDATE users SET first_name = $1, last_name = $2, updated_at = NOW() WHERE id = $3 RETURNING *`, [updatedFirstName, updatedLastName, userId]);
                    results.update.success = updateResult.rows && updateResult.rows.length > 0;
                    results.update.message = 'Successfully updated user';
                    logger_1.default.info(`UPDATE operation result: ${results.update.success ? 'SUCCESS' : 'FAILED'}`);
                }
                catch (error) {
                    results.update.message = `Error: ${error.message}`;
                    logger_1.default.error(`UPDATE operation failed: ${results.update.message}`);
                }
                // 4. Test DELETE operation
                try {
                    logger_1.default.info(`Testing DELETE operation - Delete user ${userId}`);
                    const deleteResult = await db_1.default.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
                    results.delete.success = deleteResult.rows && deleteResult.rows.length > 0;
                    results.delete.message = 'Successfully deleted user';
                    logger_1.default.info(`DELETE operation result: ${results.delete.success ? 'SUCCESS' : 'FAILED'}`);
                }
                catch (error) {
                    results.delete.message = `Error: ${error.message}`;
                    logger_1.default.error(`DELETE operation failed: ${results.delete.message}`);
                }
            }
        }
        catch (error) {
            results.create.message = `Error: ${error.message}`;
            logger_1.default.error(`CREATE operation failed: ${results.create.message}`);
        }
        // Summarize results
        const allSuccessful = Object.values(results).every(result => result.success);
        logger_1.default.info('Admin CRUD operations test completed');
        logger_1.default.info(`Overall result: ${allSuccessful ? 'SUCCESS' : 'FAILED'}`);
        logger_1.default.info('Detailed results:');
        Object.entries(results).forEach(([operation, result]) => {
            logger_1.default.info(`- ${operation.toUpperCase()}: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`);
        });
        return {
            success: allSuccessful,
            results
        };
    }
    catch (error) {
        logger_1.default.error('Admin CRUD operations test failed:', error);
        return {
            success: false,
            message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error
        };
    }
    finally {
        // Don't close the database connection here as it might be needed by other operations
    }
};
exports.testAdminCrud = testAdminCrud;
exports.default = exports.testAdminCrud;
//# sourceMappingURL=testAdminCrud.js.map