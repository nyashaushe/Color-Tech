import { Request, Response, NextFunction } from 'express';
/**
 * Validate that required fields are present in the request body
 * @param fields Array of required field names
 */
export declare const validateRequiredFields: (fields: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Validate that a field is a valid email
 * @param field The field name to validate
 */
export declare const validateEmail: (field?: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Validate that a field is a valid date
 * @param field The field name to validate
 */
export declare const validateDate: (field: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Validate that a field is a valid number
 * @param field The field name to validate
 * @param min Optional minimum value
 * @param max Optional maximum value
 */
export declare const validateNumber: (field: string, min?: number, max?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Validate that a field is a valid string with a specific length
 * @param field The field name to validate
 * @param minLength Optional minimum length
 * @param maxLength Optional maximum length
 */
export declare const validateString: (field: string, minLength?: number, maxLength?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Validate that a field is one of a set of allowed values
 * @param field The field name to validate
 * @param allowedValues Array of allowed values
 */
export declare const validateEnum: (field: string, allowedValues: any[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
declare const _default: {
    validateRequiredFields: (fields: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    validateEmail: (field?: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    validateDate: (field: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    validateNumber: (field: string, min?: number, max?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    validateString: (field: string, minLength?: number, maxLength?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    validateEnum: (field: string, allowedValues: any[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
};
export default _default;
