import { Request, Response } from 'express';
declare class VehicleController {
    /**
     * Get all vehicles (admin/staff only)
     */
    getAllVehicles(req: Request, res: Response): Promise<any>;
    /**
     * Get vehicles belonging to the authenticated user
     */
    getMyVehicles(req: Request, res: Response): Promise<any>;
    /**
     * Get a specific vehicle by ID
     */
    getVehicleById(req: Request, res: Response): Promise<any>;
    /**
     * Create a new vehicle
     */
    createVehicle(req: Request, res: Response): Promise<any>;
    /**
     * Update a vehicle
     */
    updateVehicle(req: Request, res: Response): Promise<any>;
    /**
     * Delete a vehicle
     */
    deleteVehicle(req: Request, res: Response): Promise<any>;
}
declare const _default: VehicleController;
export default _default;
