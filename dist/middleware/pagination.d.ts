import { Request } from 'express';
/**
 * Pagination result interface
 */
export interface PaginationResult {
    page: number;
    limit: number;
    offset: number;
}
/**
 * Middleware to handle pagination parameters
 * @param req Express request object
 * @returns Pagination parameters (page, limit, offset)
 */
export declare const paginationMiddleware: (req: Request) => PaginationResult;
export default paginationMiddleware;
