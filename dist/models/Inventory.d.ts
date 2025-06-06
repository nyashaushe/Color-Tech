interface Inventory {
    id: number;
    name: string;
    description: string;
    category: string;
    sku: string;
    quantity: number;
    unit: string;
    min_quantity: number;
    cost_price: number;
    supplier_id?: number;
    location?: string;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
}
interface InventoryInput {
    name: string;
    description: string;
    category: string;
    sku: string;
    quantity: number;
    unit: string;
    min_quantity: number;
    cost_price: number;
    supplier_id?: number;
    location?: string;
    created_by: number;
    updated_by: number;
}
interface InventoryUsage {
    inventory_id: number;
    name: string;
    quantity_used: number;
    unit: string;
    usage_count: number;
}
declare class InventoryModel {
    /**
     * Find all inventory items with pagination and optional category filtering
     */
    findAll(limit: number, offset: number, category?: string): Promise<Inventory[]>;
    /**
     * Count inventory items for pagination with optional category filtering
     */
    countAll(category?: string): Promise<number>;
    /**
     * Find inventory item by ID
     */
    findById(id: number): Promise<Inventory | null>;
    /**
     * Find inventory items by category with pagination
     */
    findByCategory(category: string, limit: number, offset: number): Promise<Inventory[]>;
    /**
     * Count inventory items by category for pagination
     */
    countByCategory(category: string): Promise<number>;
    /**
     * Find low stock inventory items with pagination
     */
    findLowStock(limit: number, offset: number): Promise<Inventory[]>;
    /**
     * Count low stock inventory items for pagination
     */
    countLowStock(): Promise<number>;
    /**
     * Create a new inventory item
     */
    create(inventoryData: InventoryInput): Promise<Inventory>;
    /**
     * Update an inventory item
     */
    update(id: number, inventoryData: Partial<InventoryInput>): Promise<Inventory | null>;
    /**
     * Update inventory quantity and log the adjustment
     */
    updateQuantity(id: number, quantity: number, updatedBy: number, adjustmentReason?: string): Promise<Inventory | null>;
    /**
     * Delete an inventory item
     */
    delete(id: number): Promise<boolean>;
    /**
     * Get inventory categories
     */
    getCategories(): Promise<string[]>;
    /**
     * Get inventory usage statistics
     */
    getUsageStats(timeframe?: string, limit?: number): Promise<InventoryUsage[]>;
}
declare const _default: InventoryModel;
export default _default;
