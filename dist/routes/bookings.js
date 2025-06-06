"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BookingController_1 = __importDefault(require("../controllers/BookingController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const pagination_1 = require("../middleware/pagination");
const router = express_1.default.Router();
// Public routes
router.get('/available-slots/:date', BookingController_1.default.getAvailableTimeSlots);
// Client routes
router.get('/my-bookings', auth_1.authenticate, pagination_1.paginationMiddleware, BookingController_1.default.getMyBookings);
router.post('/', auth_1.authenticate, (0, validation_1.validateRequiredFields)(['vehicle_id', 'service_ids', 'scheduled_date', 'scheduled_time']), (0, validation_1.validateDate)('scheduled_date'), BookingController_1.default.createBooking);
router.get('/:id', auth_1.authenticate, BookingController_1.default.getBookingById);
router.put('/:id', auth_1.authenticate, BookingController_1.default.updateBooking);
router.put('/:id/cancel', auth_1.authenticate, BookingController_1.default.cancelBooking);
// Admin routes
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), pagination_1.paginationMiddleware, BookingController_1.default.getAllBookings);
router.get('/stats', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), BookingController_1.default.getBookingStats);
router.put('/:id/status', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), (0, validation_1.validateRequiredFields)(['status']), (0, validation_1.validateEnum)('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']), BookingController_1.default.updateBooking);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), BookingController_1.default.deleteBooking);
exports.default = router;
//# sourceMappingURL=bookings.js.map