"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.cancelBooking = exports.updateBooking = exports.createBooking = exports.getBookingById = exports.getMyBookings = exports.getAllBookings = void 0;
const api_1 = __importDefault(require("./api"));
// Admin: Get all bookings
const getAllBookings = async () => {
    const response = await api_1.default.get('/bookings');
    return response.data;
};
exports.getAllBookings = getAllBookings;
// Client: Get current user's bookings
const getMyBookings = async () => {
    const response = await api_1.default.get('/bookings/my-bookings');
    return response.data;
};
exports.getMyBookings = getMyBookings;
// Get booking by ID
const getBookingById = async (id) => {
    const response = await api_1.default.get(`/bookings/${id}`);
    return response.data;
};
exports.getBookingById = getBookingById;
// Create new booking
const createBooking = async (data) => {
    const response = await api_1.default.post('/bookings', data);
    return response.data;
};
exports.createBooking = createBooking;
// Update booking
const updateBooking = async (id, data) => {
    const response = await api_1.default.put(`/bookings/${id}`, data);
    return response.data;
};
exports.updateBooking = updateBooking;
// Cancel booking (client)
const cancelBooking = async (id) => {
    return (0, exports.updateBooking)(id, { status: 'cancelled' });
};
exports.cancelBooking = cancelBooking;
// Delete booking
const deleteBooking = async (id) => {
    const response = await api_1.default.delete(`/bookings/${id}`);
    return response.data;
};
exports.deleteBooking = deleteBooking;
//# sourceMappingURL=bookingService.js.map