/**
 * Utility to test admin CRUD operations directly against the database
 * This can be run manually to verify that admin operations are working correctly
 */
export declare const testAdminCrud: (baseUrl: string, adminToken: string) => Promise<{
    success: boolean;
    results: {
        read: {
            success: boolean;
            message: string;
        };
        create: {
            success: boolean;
            message: string;
        };
        update: {
            success: boolean;
            message: string;
        };
        delete: {
            success: boolean;
            message: string;
        };
    };
    message?: undefined;
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    results?: undefined;
}>;
export default testAdminCrud;
