"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const errorHandler_1 = require("../utils/errorHandler");
const pagination_1 = require("../utils/pagination");
const logger_1 = __importDefault(require("../utils/logger"));
const auditLogger_1 = require("../utils/auditLogger");
class VehicleController {
    /**
     * Get all vehicles (admin/staff only)
     */
    async getAllVehicles(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const vehicles = await Vehicle_1.default.findAll(pagination.limit, pagination.offset);
            const totalCount = await Vehicle_1.default.countVehicles();
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(vehicles, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting all vehicles:', error);
            return (0, errorHandler_1.handleDatabaseError)(error, res, 'Failed to retrieve vehicles');
        }
    }
    /**
     * Get vehicles belonging to the authenticated user
     */
    async getMyVehicles(req, res) {
        try {
            const userId = req.user.id;
            const vehicles = await Vehicle_1.default.findByUserId(userId);
            return res.status(200).json({ vehicles });
        }
        catch (error) {
            logger_1.default.error('Error getting user vehicles:', error);
            return (0, errorHandler_1.handleDatabaseError)(error, res, 'Failed to retrieve your vehicles');
        }
    }
    /**
     * Get a specific vehicle by ID
     */
    async getVehicleById(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle_1.default.findById(parseInt(id));
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            // Check if the vehicle belongs to the user or user is admin/staff
            const userId = req.user.id;
            const userRole = req.user.role;
            if (vehicle.user_id !== userId && !['admin', 'staff'].includes(userRole)) {
                return res.status(403).json({ message: 'You do not have permission to view this vehicle' });
            }
            return res.status(200).json({ vehicle });
        }
        catch (error) {
            logger_1.default.error('Error getting vehicle by ID:', error);
            return (0, errorHandler_1.handleDatabaseError)(error, res, 'Failed to retrieve vehicle');
        }
    }
    /**
     * Create a new vehicle
     */
    async createVehicle(req, res) {
        try {
            const userId = req.user.id;
            const vehicleData = {
                ...req.body,
                user_id: userId
            };
            const vehicle = await Vehicle_1.default.create(vehicleData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'vehicles',
                record_id: vehicle.id,
                new_values: vehicleData,
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Vehicle created successfully',
                vehicle
            });
        }
        catch (error) {
            logger_1.default.error('Error creating vehicle:', error);
            return (0, errorHandler_1.handleDatabaseError)(error, res, 'Failed to create vehicle');
        }
    }
    /**
     * Update a vehicle
     */
    async updateVehicle(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            // Get the original vehicle to check ownership and for audit logging
            const originalVehicle = await Vehicle_1.default.findById(parseInt(id));
            if (!originalVehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            // Check if the vehicle belongs to the user or user is admin
            if (originalVehicle.user_id !== userId && !['admin'].includes(userRole)) {
                return res.status(403).json({ message: 'You do not have permission to update this vehicle' });
            }
            const updatedVehicle = await Vehicle_1.default.update(parseInt(id), userId, req.body);
            if (!updatedVehicle) {
                return res.status(404).json({ message: 'Vehicle not found or update failed' });
            }
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'vehicles',
                record_id: parseInt(id),
                old_values: originalVehicle,
                new_values: updatedVehicle,
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Vehicle updated successfully',
                vehicle: updatedVehicle
            });
        }
        catch (error) {
            logger_1.default.error('Error updating vehicle:', error);
            return (0, errorHandler_1.handleDatabaseError)(error, res, 'Failed to update vehicle');
        }
    }
    /**
     * Delete a vehicle
     */
    async deleteVehicle(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;
            // Get the original vehicle to check ownership and for audit logging
            const vehicle = await Vehicle_1.default.findById(parseInt(id));
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            // Check if the vehicle belongs to the user or user is admin
            if (vehicle.user_id !== userId && !['admin'].includes(userRole)) {
                return res.status(403).json({ message: 'You do not have permission to delete this vehicle' });
            }
            const deleted = await Vehicle_1.default.delete(parseInt(id), userId);
            if (!deleted) {
                return res.status(404).json({ message: 'Vehicle not found or delete failed' });
            }
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'vehicles',
                record_id: parseInt(id),
                old_values: vehicle,
                ip_address: req.ip
            });
            return res.status(200).json({ message: 'Vehicle deleted successfully' });
        }
        catch (error) {
            logger_1.default.error('Error deleting vehicle:', error);
            return (0, errorHandler_1.handleDatabaseError)(error, res, 'Failed to delete vehicle');
        }
    }
}
exports.default = new VehicleController();
//# sourceMappingURL=VehicleController.js.map