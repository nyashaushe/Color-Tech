"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../utils/validation");
const pagination_1 = require("../utils/pagination");
const ContentController_1 = __importDefault(require("../controllers/ContentController"));
const router = express_1.default.Router();
// Public routes
router.get('/', (0, pagination_1.paginationMiddleware)(), ContentController_1.default.getAllPublishedContent);
router.get('/types/:type', (0, pagination_1.paginationMiddleware)(), ContentController_1.default.getContentByType);
router.get('/:id', ContentController_1.default.getContentById);
// Admin routes
router.get('/all', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), (0, pagination_1.paginationMiddleware)(), ContentController_1.default.getAllContent);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), (0, validation_1.validateRequiredFields)(['title', 'content_type', 'body']), (0, validation_1.validateString)('title', 1, 255), (0, validation_1.validateEnum)('content_type', ['blog', 'gallery', 'testimonial', 'faq']), (0, validation_1.validateString)('body', 1), ContentController_1.default.createContent);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), (0, validation_1.validateString)('title', 1, 255), (0, validation_1.validateEnum)('content_type', ['blog', 'gallery', 'testimonial', 'faq']), (0, validation_1.validateString)('body', 1), ContentController_1.default.updateContent);
router.put('/:id/publish', auth_1.authenticate, (0, auth_1.authorize)('admin'), ContentController_1.default.publishContent);
router.put('/:id/unpublish', auth_1.authenticate, (0, auth_1.authorize)('admin'), ContentController_1.default.unpublishContent);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), ContentController_1.default.deleteContent);
// Gallery specific routes
router.post('/gallery/upload', auth_1.authenticate, (0, auth_1.authorize)('admin', 'staff'), ContentController_1.default.uploadGalleryImage);
// Blog specific routes
router.get('/blog/featured', ContentController_1.default.getFeaturedBlogPosts);
// FAQ specific routes
router.get('/faq/categories', ContentController_1.default.getFaqCategories);
exports.default = router;
//# sourceMappingURL=content.js.map