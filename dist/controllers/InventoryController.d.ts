import { Request, Response } from 'express';
declare class InventoryController {
    /**
     * Get all inventory items with pagination
     */
    getAllInventory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get inventory item by ID
     */
    getInventoryById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get inventory items by category
     */
    getInventoryByCategory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get low stock inventory items
     */
    getLowStockInventory(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new inventory item
     */
    createInventoryItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update an inventory item
     */
    updateInventoryItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update inventory quantity
     */
    updateInventoryQuantity(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete an inventory item (admin only)
     */
    deleteInventoryItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get inventory categories
     */
    getInventoryCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get inventory usage statistics (admin only)
     */
    getInventoryUsageStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: InventoryController;
export default _default;
