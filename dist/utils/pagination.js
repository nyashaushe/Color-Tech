"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.getPaginationSQL = exports.paginationMiddleware = exports.addPaginationMetadata = exports.getPaginationParams = void 0;
// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
/**
 * Extract pagination parameters from request query
 * @param req Express request object
 * @returns Pagination parameters
 */
const getPaginationParams = (req) => {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || DEFAULT_PAGE;
    let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
    // Ensure limit doesn't exceed maximum
    if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT;
    }
    // Calculate offset
    const offset = (page - 1) * limit;
    return {
        page,
        limit,
        offset
    };
};
exports.getPaginationParams = getPaginationParams;
/**
 * Add pagination metadata to response
 * @param result Pagination result
 * @param totalItems Total number of items
 * @returns Pagination result with metadata
 */
const addPaginationMetadata = (result, totalItems) => {
    const totalPages = Math.ceil(totalItems / result.limit);
    return {
        ...result,
        totalItems,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPrevPage: result.page > 1
    };
};
exports.addPaginationMetadata = addPaginationMetadata;
/**
 * Create pagination middleware
 * @param options Optional pagination options
 */
const paginationMiddleware = (options) => {
    const maxLimit = options?.maxLimit || MAX_LIMIT;
    const defaultLimit = options?.defaultLimit || DEFAULT_LIMIT;
    return (req, res, next) => {
        // Get page and limit from query parameters
        const page = Math.max(parseInt(req.query.page) || DEFAULT_PAGE, 1);
        let limit = parseInt(req.query.limit) || defaultLimit;
        // Ensure limit doesn't exceed maximum
        if (limit > maxLimit) {
            limit = maxLimit;
        }
        // Calculate offset
        const offset = (page - 1) * limit;
        // Add pagination to request object
        req.pagination = {
            page,
            limit,
            offset
        };
        next();
    };
};
exports.paginationMiddleware = paginationMiddleware;
/**
 * Generate pagination SQL
 * @param pagination Pagination parameters
 * @returns SQL string for pagination
 */
const getPaginationSQL = (pagination) => {
    return `LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
};
exports.getPaginationSQL = getPaginationSQL;
/**
 * Format paginated response
 * @param data Data to include in response
 * @param pagination Pagination metadata
 * @returns Formatted response object
 */
const paginatedResponse = (data, pagination) => {
    return {
        data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            totalItems: pagination.totalItems,
            totalPages: pagination.totalPages,
            hasNextPage: pagination.hasNextPage,
            hasPrevPage: pagination.hasPrevPage
        }
    };
};
exports.paginatedResponse = paginatedResponse;
exports.default = {
    getPaginationParams: exports.getPaginationParams,
    addPaginationMetadata: exports.addPaginationMetadata,
    paginationMiddleware: exports.paginationMiddleware,
    getPaginationSQL: exports.getPaginationSQL,
    paginatedResponse: exports.paginatedResponse
};
//# sourceMappingURL=pagination.js.map