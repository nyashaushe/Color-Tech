"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.handleServerError = void 0;
const logger_1 = __importDefault(require("./logger"));
/**
 * Handle server errors and return appropriate response
 * @param res Express response object
 * @param error Error object
 * @param message Custom error message
 * @returns Express response with error details
 */
const handleServerError = (res, error, message = 'Internal server error') => {
    // Log the error
    logger_1.default.error(`${message}: ${error.message || error}`);
    // Determine if this is a known error type with a specific status code
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            message: error.message || message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
    // Handle specific error types
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            message: 'A record with this information already exists',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({
            message: 'Referenced record does not exist',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    // Default to 500 Internal Server Error
    return res.status(500).json({
        message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};
exports.handleServerError = handleServerError;
/**
 * Create a custom error with status code
 * @param message Error message
 * @param statusCode HTTP status code
 * @returns Error object with status code
 */
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
exports.createError = createError;
exports.default = {
    handleServerError: exports.handleServerError,
    createError: exports.createError
};
//# sourceMappingURL=errorHandler.js.map