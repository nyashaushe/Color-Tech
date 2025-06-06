"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = __importDefault(require("../models/Service"));
const errorHandler_1 = require("../utils/errorHandler");
const pagination_1 = require("../utils/pagination");
const logger_1 = __importDefault(require("../utils/logger"));
const auditLogger_1 = require("../utils/auditLogger");
class ServiceController {
    /**
     * Get all services with optional filtering
     */
    async getAllServices(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const categoryId = req.query.category_id ? parseInt(req.query.category_id) : undefined;
            const isActive = req.query.is_active === 'true' ? true :
                req.query.is_active === 'false' ? false : undefined;
            const services = await Service_1.default.findAll(pagination.limit, pagination.offset, categoryId, isActive);
            // Get total count for pagination
            const totalCount = await Service_1.default.countServices(categoryId, isActive);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(services, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting all services:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve services');
        }
    }
    /**
     * Get service categories
     */
    async getServiceCategories(req, res) {
        try {
            const categories = await Service_1.default.getCategories();
            return res.status(200).json({ categories });
        }
        catch (error) {
            logger_1.default.error('Error getting service categories:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve service categories');
        }
    }
    /**
     * Get a specific service by ID
     */
    async getServiceById(req, res) {
        try {
            const { id } = req.params;
            const service = await Service_1.default.findById(parseInt(id));
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
            return res.status(200).json({ service });
        }
        catch (error) {
            logger_1.default.error('Error getting service by ID:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve service');
        }
    }
    /**
     * Create a new service (admin only)
     */
    async createService(req, res) {
        try {
            const userId = req.user.id;
            const serviceData = req.body;
            const service = await Service_1.default.create(serviceData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'services',
                record_id: service.id,
                new_values: serviceData,
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Service created successfully',
                service
            });
        }
        catch (error) {
            logger_1.default.error('Error creating service:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to create service');
        }
    }
    /**
     * Update a service (admin only)
     */
    async updateService(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original service for audit logging
            const originalService = await Service_1.default.findById(parseInt(id));
            if (!originalService) {
                return res.status(404).json({ message: 'Service not found' });
            }
            const updatedService = await Service_1.default.update(parseInt(id), req.body);
            if (!updatedService) {
                return res.status(404).json({ message: 'Service not found or update failed' });
            }
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'services',
                record_id: parseInt(id),
                old_values: originalService,
                new_values: updatedService,
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Service updated successfully',
                service: updatedService
            });
        }
        catch (error) {
            logger_1.default.error('Error updating service:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update service');
        }
    }
    /**
     * Delete a service (admin only)
     */
    async deleteService(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original service for audit logging
            const service = await Service_1.default.findById(parseInt(id));
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
            const deleted = await Service_1.default.delete(parseInt(id));
            if (!deleted) {
                return res.status(400).json({
                    message: 'Service could not be deleted. It may be in use by existing bookings.'
                });
            }
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'services',
                record_id: parseInt(id),
                old_values: service,
                ip_address: req.ip
            });
            return res.status(200).json({ message: 'Service deleted successfully' });
        }
        catch (error) {
            logger_1.default.error('Error deleting service:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to delete service');
        }
    }
    /**
     * Create a new service category (admin only)
     */
    async createServiceCategory(req, res) {
        try {
            const userId = req.user.id;
            const { name, description } = req.body;
            // This method needs to be implemented in the ServiceModel
            const category = await Service_1.default.createCategory({ name, description });
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'service_categories',
                record_id: category.id,
                new_values: { name, description },
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Service category created successfully',
                category
            });
        }
        catch (error) {
            logger_1.default.error('Error creating service category:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to create service category');
        }
    }
    /**
     * Update a service category (admin only)
     */
    async updateServiceCategory(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { name, description } = req.body;
            // These methods need to be implemented in the ServiceModel
            const originalCategory = await Service_1.default.findCategoryById(parseInt(id));
            if (!originalCategory) {
                return res.status(404).json({ message: 'Service category not found' });
            }
            const updatedCategory = await Service_1.default.updateCategory(parseInt(id), { name, description });
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'service_categories',
                record_id: parseInt(id),
                old_values: originalCategory,
                new_values: updatedCategory,
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Service category updated successfully',
                category: updatedCategory
            });
        }
        catch (error) {
            logger_1.default.error('Error updating service category:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update service category');
        }
    }
    /**
     * Delete a service category (admin only)
     */
    async deleteServiceCategory(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // These methods need to be implemented in the ServiceModel
            const category = await Service_1.default.findCategoryById(parseInt(id));
            if (!category) {
                return res.status(404).json({ message: 'Service category not found' });
            }
            const deleted = await Service_1.default.deleteCategory(parseInt(id));
            if (!deleted) {
                return res.status(400).json({
                    message: 'Category could not be deleted. It may be in use by existing services.'
                });
            }
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'service_categories',
                record_id: parseInt(id),
                old_values: category,
                ip_address: req.ip
            });
            return res.status(200).json({ message: 'Service category deleted successfully' });
        }
        catch (error) {
            logger_1.default.error('Error deleting service category:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to delete service category');
        }
    }
}
exports.default = new ServiceController();
//# sourceMappingURL=ServiceController.js.map