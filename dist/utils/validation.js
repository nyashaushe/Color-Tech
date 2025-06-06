"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnum = exports.validateString = exports.validateNumber = exports.validateDate = exports.validateEmail = exports.validateRequiredFields = void 0;
const logger_1 = __importDefault(require("./logger"));
/**
 * Validate that required fields are present in the request body
 * @param fields Array of required field names
 */
const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        const missingFields = fields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            logger_1.default.warn(`Missing required fields: ${missingFields.join(', ')}`);
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields
            });
        }
        next();
    };
};
exports.validateRequiredFields = validateRequiredFields;
/**
 * Validate that a field is a valid email
 * @param field The field name to validate
 */
const validateEmail = (field = 'email') => {
    return (req, res, next) => {
        const email = req.body[field];
        if (!email) {
            return next(); // Skip validation if field is not present
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            logger_1.default.warn(`Invalid email format: ${email}`);
            return res.status(400).json({
                message: 'Invalid email format',
                field
            });
        }
        next();
    };
};
exports.validateEmail = validateEmail;
/**
 * Validate that a field is a valid date
 * @param field The field name to validate
 */
const validateDate = (field) => {
    return (req, res, next) => {
        const date = req.body[field];
        if (!date) {
            return next(); // Skip validation if field is not present
        }
        const dateObj = new Date(date);
        if (dateObj.toString() === 'Invalid Date') {
            logger_1.default.warn(`Invalid date format: ${date}`);
            return res.status(400).json({
                message: 'Invalid date format',
                field
            });
        }
        next();
    };
};
exports.validateDate = validateDate;
/**
 * Validate that a field is a valid number
 * @param field The field name to validate
 * @param min Optional minimum value
 * @param max Optional maximum value
 */
const validateNumber = (field, min, max) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value === undefined || value === null) {
            return next(); // Skip validation if field is not present
        }
        const num = Number(value);
        if (isNaN(num)) {
            logger_1.default.warn(`Invalid number format: ${value}`);
            return res.status(400).json({
                message: 'Invalid number format',
                field
            });
        }
        if (min !== undefined && num < min) {
            logger_1.default.warn(`Number below minimum: ${num} < ${min}`);
            return res.status(400).json({
                message: `Value must be at least ${min}`,
                field
            });
        }
        if (max !== undefined && num > max) {
            logger_1.default.warn(`Number above maximum: ${num} > ${max}`);
            return res.status(400).json({
                message: `Value must be at most ${max}`,
                field
            });
        }
        next();
    };
};
exports.validateNumber = validateNumber;
/**
 * Validate that a field is a valid string with a specific length
 * @param field The field name to validate
 * @param minLength Optional minimum length
 * @param maxLength Optional maximum length
 */
const validateString = (field, minLength, maxLength) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value === undefined || value === null) {
            return next(); // Skip validation if field is not present
        }
        if (typeof value !== 'string') {
            logger_1.default.warn(`Invalid string format: ${value}`);
            return res.status(400).json({
                message: 'Invalid string format',
                field
            });
        }
        if (minLength !== undefined && value.length < minLength) {
            logger_1.default.warn(`String below minimum length: ${value.length} < ${minLength}`);
            return res.status(400).json({
                message: `Field must be at least ${minLength} characters`,
                field
            });
        }
        if (maxLength !== undefined && value.length > maxLength) {
            logger_1.default.warn(`String above maximum length: ${value.length} > ${maxLength}`);
            return res.status(400).json({
                message: `Field must be at most ${maxLength} characters`,
                field
            });
        }
        next();
    };
};
exports.validateString = validateString;
/**
 * Validate that a field is one of a set of allowed values
 * @param field The field name to validate
 * @param allowedValues Array of allowed values
 */
const validateEnum = (field, allowedValues) => {
    return (req, res, next) => {
        const value = req.body[field];
        if (value === undefined || value === null) {
            return next(); // Skip validation if field is not present
        }
        if (!allowedValues.includes(value)) {
            logger_1.default.warn(`Invalid enum value: ${value}, allowed: ${allowedValues.join(', ')}`);
            return res.status(400).json({
                message: `Invalid value. Allowed values: ${allowedValues.join(', ')}`,
                field
            });
        }
        next();
    };
};
exports.validateEnum = validateEnum;
exports.default = {
    validateRequiredFields: exports.validateRequiredFields,
    validateEmail: exports.validateEmail,
    validateDate: exports.validateDate,
    validateNumber: exports.validateNumber,
    validateString: exports.validateString,
    validateEnum: exports.validateEnum
};
//# sourceMappingURL=validation.js.map