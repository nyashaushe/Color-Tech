import { Request, Response, NextFunction } from 'express';
export interface PaginationResult {
    page: number;
    limit: number;
    offset: number;
    totalPages?: number;
    totalItems?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
}
/**
 * Extract pagination parameters from request query
 * @param req Express request object
 * @returns Pagination parameters
 */
export declare const getPaginationParams: (req: Request) => PaginationResult;
/**
 * Add pagination metadata to response
 * @param result Pagination result
 * @param totalItems Total number of items
 * @returns Pagination result with metadata
 */
export declare const addPaginationMetadata: (result: PaginationResult, totalItems: number) => PaginationResult;
/**
 * Create pagination middleware
 * @param options Optional pagination options
 */
export declare const paginationMiddleware: (options?: {
    maxLimit?: number;
    defaultLimit?: number;
}) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Generate pagination SQL
 * @param pagination Pagination parameters
 * @returns SQL string for pagination
 */
export declare const getPaginationSQL: (pagination: PaginationResult) => string;
/**
 * Format paginated response
 * @param data Data to include in response
 * @param pagination Pagination metadata
 * @returns Formatted response object
 */
export declare const paginatedResponse: (data: any[], pagination: PaginationResult) => {
    data: any[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number | undefined;
        totalPages: number | undefined;
        hasNextPage: boolean | undefined;
        hasPrevPage: boolean | undefined;
    };
};
declare const _default: {
    getPaginationParams: (req: Request) => PaginationResult;
    addPaginationMetadata: (result: PaginationResult, totalItems: number) => PaginationResult;
    paginationMiddleware: (options?: {
        maxLimit?: number;
        defaultLimit?: number;
    }) => (req: Request, res: Response, next: NextFunction) => void;
    getPaginationSQL: (pagination: PaginationResult) => string;
    paginatedResponse: (data: any[], pagination: PaginationResult) => {
        data: any[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number | undefined;
            totalPages: number | undefined;
            hasNextPage: boolean | undefined;
            hasPrevPage: boolean | undefined;
        };
    };
};
export default _default;
