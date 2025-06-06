"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const pagination_1 = require("../middleware/pagination");
const ServiceController_1 = __importDefault(require("../controllers/ServiceController"));
const router = express_1.default.Router();
// Public routes
router.get('/', pagination_1.paginationMiddleware, ServiceController_1.default.getAllServices);
router.get('/categories', ServiceController_1.default.getServiceCategories);
router.get('/:id', ServiceController_1.default.getServiceById);
// Admin routes
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, validation_1.validateRequiredFields)(['name', 'description', 'price', 'duration_minutes', 'category_id']), (0, validation_1.validateString)('name', 2, 100), (0, validation_1.validateString)('description', 10, 1000), (0, validation_1.validateNumber)('price', 0), (0, validation_1.validateNumber)('duration_minutes', 5), (0, validation_1.validateNumber)('category_id', 1), ServiceController_1.default.createService);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), ServiceController_1.default.updateService);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), ServiceController_1.default.deleteService);
// Category management (admin only)
router.post('/categories', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, validation_1.validateRequiredFields)(['name', 'description']), (0, validation_1.validateString)('name', 2, 50), (0, validation_1.validateString)('description', 10, 500), ServiceController_1.default.createServiceCategory);
router.put('/categories/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), ServiceController_1.default.updateServiceCategory);
router.delete('/categories/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), ServiceController_1.default.deleteServiceCategory);
exports.default = router;
//# sourceMappingURL=services.js.map