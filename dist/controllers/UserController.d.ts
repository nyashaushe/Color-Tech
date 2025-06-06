import { Request, Response } from 'express';
declare class UserController {
    /**
     * Register a new user
     */
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Login user
     */
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user profile
     */
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update user profile
     */
    updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all users (admin only)
     */
    getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user by ID (admin only)
     */
    getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update user (admin only)
     */
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete user (admin only)
     */
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Change user password
     */
    changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Reset user password (admin only)
     */
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: UserController;
export default _default;
