"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = __importDefault(require("./utils/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const services_1 = __importDefault(require("./routes/services"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const content_1 = __importDefault(require("./routes/content"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const verifyJwtConfig_1 = require("./utils/verifyJwtConfig");
// Create Express app
const app = (0, express_1.default)();
const PORT = config_1.config.server.port;
// Middleware
app.use((0, cors_1.default)({
    origin: config_1.config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Log request information
app.use((req, res, next) => {
    logger_1.default.http(`${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/vehicles', vehicles_1.default);
app.use('/api/services', services_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/content', content_1.default);
app.use('/api/inventory', inventory_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: config_1.config.server.env });
});
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    else {
        next();
    }
});
// 404 handler
app.use((req, res) => {
    logger_1.default.warn(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error('Server error:', err);
    res.status(err.status || 500).json({
        message: 'Internal Server Error',
        error: config_1.config.server.env === 'development' ? err.message : undefined
    });
});
// Start server
const server = app.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT} in ${config_1.config.server.env} mode`);
    logger_1.default.info(`Database connected to ${config_1.config.db.host}:${config_1.config.db.port}/${config_1.config.db.database}`);
    // Verify JWT configuration
    try {
        const jwtVerification = (0, verifyJwtConfig_1.verifyJwtConfig)();
        if (jwtVerification.success) {
            logger_1.default.info('JWT configuration verified successfully');
        }
        else {
            logger_1.default.error(`JWT configuration verification failed: ${jwtVerification.message}`);
            logger_1.default.warn('Server started with invalid JWT configuration - authentication may not work correctly');
        }
    }
    catch (error) {
        logger_1.default.error('Error verifying JWT configuration:', error);
        logger_1.default.warn('Server started with potentially invalid JWT configuration - authentication may not work correctly');
    }
});
// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        logger_1.default.info('HTTP server closed');
        await db_1.default.closePool();
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT signal received: closing HTTP server');
    server.close(async () => {
        logger_1.default.info('HTTP server closed');
        await db_1.default.closePool();
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map