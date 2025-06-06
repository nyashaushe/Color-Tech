"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getAllServices = void 0;
const api_1 = __importDefault(require("./api"));
// Get all services
const getAllServices = async () => {
    const response = await api_1.default.get('/services');
    return response.data;
};
exports.getAllServices = getAllServices;
// Get service by ID
const getServiceById = async (id) => {
    const response = await api_1.default.get(`/services/${id}`);
    return response.data;
};
exports.getServiceById = getServiceById;
// Create new service (admin only)
const createService = async (data) => {
    const response = await api_1.default.post('/services', data);
    return response.data;
};
exports.createService = createService;
// Update service (admin only)
const updateService = async (id, data) => {
    const response = await api_1.default.put(`/services/${id}`, data);
    return response.data;
};
exports.updateService = updateService;
// Delete service (admin only)
const deleteService = async (id) => {
    const response = await api_1.default.delete(`/services/${id}`);
    return response.data;
};
exports.deleteService = deleteService;
//# sourceMappingURL=serviceService.js.map