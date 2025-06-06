"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const jwt_1 = __importDefault(require("../lib/jwt"));
const api = axios_1.default.create({
    baseURL: config_1.config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add auth token to requests using centralized JWT configuration
api.interceptors.request.use((config) => {
    const token = jwt_1.default.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Handle token expiration
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Clear token and redirect to login using centralized JWT configuration
        jwt_1.default.removeToken();
        localStorage.removeItem('user');
        // If we're not already on the login page, redirect
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
    // Handle other errors
    return Promise.reject(error);
});
// Check if we're in a Node.js environment
const isNode = typeof window === 'undefined';
if (isNode) {
    // Node.js specific code
}
exports.default = api;
//# sourceMappingURL=api.js.map