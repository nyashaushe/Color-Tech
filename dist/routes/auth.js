"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.post('/register', AuthController_1.default.register);
router.post('/login', AuthController_1.default.login);
router.post('/logout', AuthController_1.default.logout);
// Protected routes
router.get('/profile', auth_1.authenticate, AuthController_1.default.getProfile);
router.put('/profile', auth_1.authenticate, AuthController_1.default.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map