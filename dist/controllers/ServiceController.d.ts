import { Request, Response } from 'express';
declare class ServiceController {
    /**
     * Get all services with optional filtering
     */
    getAllServices(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get service categories
     */
    getServiceCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get a specific service by ID
     */
    getServiceById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new service (admin only)
     */
    createService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update a service (admin only)
     */
    updateService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a service (admin only)
     */
    deleteService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new service category (admin only)
     */
    createServiceCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update a service category (admin only)
     */
    updateServiceCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a service category (admin only)
     */
    deleteServiceCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ServiceController;
export default _default;
