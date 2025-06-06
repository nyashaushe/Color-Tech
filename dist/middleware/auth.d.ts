import { Request, Response, NextFunction } from 'express';
interface JwtPayload {
    id: number;
    email: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
/**
 * Middleware to authenticate requests using JWT
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Middleware to authorize requests based on user roles
 */
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Optional authentication middleware - doesn't require authentication but will
 * attach user info to the request if a valid token is provided
 */
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
