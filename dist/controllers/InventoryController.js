"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inventory_1 = __importDefault(require("../models/Inventory"));
const errorHandler_1 = require("../utils/errorHandler");
const pagination_1 = require("../utils/pagination");
const logger_1 = __importDefault(require("../utils/logger"));
const auditLogger_1 = require("../utils/auditLogger");
class InventoryController {
    /**
     * Get all inventory items with pagination
     */
    async getAllInventory(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const category = req.query.category;
            const inventory = await Inventory_1.default.findAll(pagination.limit, pagination.offset, category);
            const totalCount = await Inventory_1.default.countAll(category);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(inventory, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting all inventory:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve inventory');
        }
    }
    /**
     * Get inventory item by ID
     */
    async getInventoryById(req, res) {
        try {
            const { id } = req.params;
            const item = await Inventory_1.default.findById(parseInt(id));
            if (!item) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            return res.status(200).json({ item });
        }
        catch (error) {
            logger_1.default.error('Error getting inventory by ID:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve inventory item');
        }
    }
    /**
     * Get inventory items by category
     */
    async getInventoryByCategory(req, res) {
        try {
            const { category } = req.params;
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const inventory = await Inventory_1.default.findByCategory(category, pagination.limit, pagination.offset);
            const totalCount = await Inventory_1.default.countByCategory(category);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(inventory, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error(`Error getting inventory by category ${req.params.category}:`, error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve inventory items');
        }
    }
    /**
     * Get low stock inventory items
     */
    async getLowStockInventory(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const inventory = await Inventory_1.default.findLowStock(pagination.limit, pagination.offset);
            const totalCount = await Inventory_1.default.countLowStock();
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(inventory, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting low stock inventory:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve low stock inventory');
        }
    }
    /**
     * Create a new inventory item
     */
    async createInventoryItem(req, res) {
        try {
            const userId = req.user.id;
            const itemData = {
                ...req.body,
                created_by: userId,
                updated_by: userId
            };
            const item = await Inventory_1.default.create(itemData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'inventory',
                record_id: item.id,
                new_values: itemData,
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Inventory item created successfully',
                item
            });
        }
        catch (error) {
            logger_1.default.error('Error creating inventory item:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to create inventory item');
        }
    }
    /**
     * Update an inventory item
     */
    async updateInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original item for audit logging
            const originalItem = await Inventory_1.default.findById(parseInt(id));
            if (!originalItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            const itemData = {
                ...req.body,
                updated_by: userId,
                updated_at: new Date()
            };
            const updatedItem = await Inventory_1.default.update(parseInt(id), itemData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'inventory',
                record_id: parseInt(id),
                old_values: originalItem,
                new_values: updatedItem,
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Inventory item updated successfully',
                item: updatedItem
            });
        }
        catch (error) {
            logger_1.default.error('Error updating inventory item:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update inventory item');
        }
    }
    /**
     * Update inventory quantity
     */
    async updateInventoryQuantity(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { quantity, adjustment_reason } = req.body;
            if (quantity === undefined) {
                return res.status(400).json({ message: 'Quantity is required' });
            }
            // Get the original item for audit logging
            const originalItem = await Inventory_1.default.findById(parseInt(id));
            if (!originalItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            const updatedItem = await Inventory_1.default.updateQuantity(parseInt(id), quantity, userId, adjustment_reason);
            if (!updatedItem) {
                return res.status(404).json({ message: 'Inventory item not found or update failed' });
            }
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'inventory',
                record_id: parseInt(id),
                old_values: { quantity: originalItem.quantity },
                new_values: {
                    quantity: updatedItem.quantity,
                    adjustment_reason
                },
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Inventory quantity updated successfully',
                item: updatedItem
            });
        }
        catch (error) {
            logger_1.default.error('Error updating inventory quantity:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update inventory quantity');
        }
    }
    /**
     * Delete an inventory item (admin only)
     */
    async deleteInventoryItem(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original item for audit logging
            const item = await Inventory_1.default.findById(parseInt(id));
            if (!item) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            await Inventory_1.default.delete(parseInt(id));
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'inventory',
                record_id: parseInt(id),
                old_values: item,
                ip_address: req.ip
            });
            return res.status(200).json({ message: 'Inventory item deleted successfully' });
        }
        catch (error) {
            logger_1.default.error('Error deleting inventory item:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to delete inventory item');
        }
    }
    /**
     * Get inventory categories
     */
    async getInventoryCategories(req, res) {
        try {
            const categories = await Inventory_1.default.getCategories();
            return res.status(200).json({ categories });
        }
        catch (error) {
            logger_1.default.error('Error getting inventory categories:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve inventory categories');
        }
    }
    /**
     * Get inventory usage statistics (admin only)
     */
    async getInventoryUsageStats(req, res) {
        try {
            const timeframe = req.query.timeframe || 'month'; // day, week, month, year
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const stats = await Inventory_1.default.getUsageStats(timeframe, limit);
            return res.status(200).json({ stats });
        }
        catch (error) {
            logger_1.default.error('Error getting inventory usage stats:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve inventory usage statistics');
        }
    }
}
exports.default = new InventoryController();
//# sourceMappingURL=InventoryController.js.map