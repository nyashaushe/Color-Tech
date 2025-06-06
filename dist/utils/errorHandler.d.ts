import { Response } from 'express';
/**
 * Handle server errors and return appropriate response
 * @param res Express response object
 * @param error Error object
 * @param message Custom error message
 * @returns Express response with error details
 */
export declare const handleServerError: (res: Response, error: any, message?: string) => Response;
/**
 * Create a custom error with status code
 * @param message Error message
 * @param statusCode HTTP status code
 * @returns Error object with status code
 */
export declare const createError: (message: string, statusCode?: number) => Error & {
    statusCode: number;
};
declare const _default: {
    handleServerError: (res: Response, error: any, message?: string) => Response;
    createError: (message: string, statusCode?: number) => Error & {
        statusCode: number;
    };
};
export default _default;
