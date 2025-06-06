"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const pagination_1 = require("../utils/pagination");
const InventoryController_1 = __importDefault(require("../controllers/InventoryController"));
const router = express_1.default.Router();
// All inventory routes are admin/staff only
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)('admin', 'staff'));
// Get all inventory items with pagination
router.get('/', (0, pagination_1.paginationMiddleware)(), InventoryController_1.default.getAllInventory);
// Get inventory item by ID
router.get('/:id', InventoryController_1.default.getInventoryById);
// Get inventory items by category
router.get('/category/:category', (0, pagination_1.paginationMiddleware)(), InventoryController_1.default.getInventoryByCategory);
// Get low stock inventory items
router.get('/status/low-stock', (0, pagination_1.paginationMiddleware)(), InventoryController_1.default.getLowStockInventory);
// Create new inventory item
router.post('/', (0, validation_1.validateRequiredFields)(['name', 'quantity', 'unit_price']), (0, validation_1.validateString)('name', 1, 255), (0, validation_1.validateString)('description', 0, 1000), (0, validation_1.validateNumber)('quantity', 0), (0, validation_1.validateNumber)('unit_price', 0), (0, validation_1.validateNumber)('reorder_level', 0), InventoryController_1.default.createInventoryItem);
// Update inventory item
router.put('/:id', (0, validation_1.validateString)('name', 1, 255), (0, validation_1.validateString)('description', 0, 1000), (0, validation_1.validateNumber)('quantity', 0), (0, validation_1.validateNumber)('unit_price', 0), (0, validation_1.validateNumber)('reorder_level', 0), InventoryController_1.default.updateInventoryItem);
// Update inventory quantity
router.put('/:id/quantity', (0, validation_1.validateRequiredFields)(['quantity']), (0, validation_1.validateNumber)('quantity', 0), InventoryController_1.default.updateInventoryQuantity);
// Delete inventory item (admin only)
router.delete('/:id', (0, auth_1.authorize)('admin'), InventoryController_1.default.deleteInventoryItem);
// Get inventory categories
router.get('/util/categories', InventoryController_1.default.getInventoryCategories);
// Get inventory usage statistics
router.get('/util/usage-stats', (0, auth_1.authorize)('admin'), InventoryController_1.default.getInventoryUsageStats);
exports.default = router;
//# sourceMappingURL=inventory.js.map