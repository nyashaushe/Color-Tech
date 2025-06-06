"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
/**
 * Client-side JWT configuration
 * This file contains JWT-related configuration for the client side
 */
exports.jwtConfig = {
    /**
     * JWT token storage key in localStorage
     */
    storageKey: 'token',
    /**
     * Helper function to get the JWT token from localStorage
     */
    getToken: () => {
        return localStorage.getItem(exports.jwtConfig.storageKey);
    },
    /**
     * Helper function to set the JWT token in localStorage
     */
    setToken: (token) => {
        localStorage.setItem(exports.jwtConfig.storageKey, token);
    },
    /**
     * Helper function to remove the JWT token from localStorage
     */
    removeToken: () => {
        localStorage.removeItem(exports.jwtConfig.storageKey);
    },
    /**
     * Helper function to get the Authorization header with the JWT token
     */
    getAuthHeader: () => {
        const token = exports.jwtConfig.getToken();
        return token ? { Authorization: `Bearer ${token}` } : undefined;
    }
};
exports.default = exports.jwtConfig;
//# sourceMappingURL=jwt.js.map