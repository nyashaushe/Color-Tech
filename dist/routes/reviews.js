"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const pagination_1 = require("../utils/pagination");
const ReviewController_1 = __importDefault(require("../controllers/ReviewController"));
const router = express_1.default.Router();
// Public routes
router.get('/', (0, pagination_1.paginationMiddleware)(), ReviewController_1.default.getPublicReviews);
router.get('/service/:serviceId', (0, pagination_1.paginationMiddleware)(), ReviewController_1.default.getReviewsByServiceId);
// Client routes
router.get('/my-reviews', auth_1.authenticate, ReviewController_1.default.getMyReviews);
router.post('/', auth_1.authenticate, (0, validation_1.validateRequiredFields)(['service_id', 'booking_id', 'rating', 'comment']), (0, validation_1.validateNumber)('service_id', 1), (0, validation_1.validateNumber)('booking_id', 1), (0, validation_1.validateNumber)('rating', 1, 5), (0, validation_1.validateString)('comment', 1, 1000), ReviewController_1.default.createReview);
router.put('/:id', auth_1.authenticate, (0, validation_1.validateNumber)('rating', 1, 5), (0, validation_1.validateString)('comment', 1, 1000), ReviewController_1.default.updateReview);
router.delete('/:id', auth_1.authenticate, ReviewController_1.default.deleteReview);
// Admin routes
router.get('/all', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), (0, pagination_1.paginationMiddleware)(), ReviewController_1.default.getAllReviews);
router.put('/:id/status', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), (0, validation_1.validateRequiredFields)(['status']), (0, validation_1.validateEnum)('status', ['pending', 'approved', 'rejected']), ReviewController_1.default.updateReviewStatus);
router.delete('/:id/admin', auth_1.authenticate, (0, auth_1.authorize)('admin'), ReviewController_1.default.adminDeleteReview);
exports.default = router;
//# sourceMappingURL=reviews.js.map