"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteFile = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("./logger"));
// Ensure upload directories exist
const createDirectories = () => {
    const dirs = [
        './uploads',
        './uploads/gallery',
        './uploads/vehicles',
        './uploads/services',
        './uploads/profiles'
    ];
    dirs.forEach(dir => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
            logger_1.default.info(`Created directory: ${dir}`);
        }
    });
};
// Create directories on startup
createDirectories();
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Determine the destination folder based on the upload type
        let uploadPath = './uploads';
        if (req.path.includes('/gallery')) {
            uploadPath = './uploads/gallery';
        }
        else if (req.path.includes('/vehicles')) {
            uploadPath = './uploads/vehicles';
        }
        else if (req.path.includes('/services')) {
            uploadPath = './uploads/services';
        }
        else if (req.path.includes('/profiles')) {
            uploadPath = './uploads/profiles';
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with original extension
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExt}`;
        cb(null, fileName);
    }
});
// File filter to allow only images
const imageFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WEBP)'), false);
    }
};
// Create upload instances
exports.uploadImage = (0, multer_1.default)({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});
// Helper function to delete a file
const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        // Check if the file exists
        if (!fs_1.default.existsSync(filePath)) {
            logger_1.default.warn(`File not found for deletion: ${filePath}`);
            return resolve();
        }
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                logger_1.default.error(`Error deleting file ${filePath}: ${err.message}`);
                return reject(err);
            }
            logger_1.default.info(`Successfully deleted file: ${filePath}`);
            resolve();
        });
    });
};
exports.deleteFile = deleteFile;
// Helper function to get file URL from filename
const getFileUrl = (filename, type = 'gallery') => {
    return `/uploads/${type}/${filename}`;
};
exports.getFileUrl = getFileUrl;
exports.default = {
    uploadImage: exports.uploadImage,
    deleteFile: exports.deleteFile,
    getFileUrl: exports.getFileUrl
};
//# sourceMappingURL=fileUpload.js.map