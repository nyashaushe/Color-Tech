"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Content_1 = __importDefault(require("../models/Content"));
const errorHandler_1 = require("../utils/errorHandler");
const pagination_1 = require("../utils/pagination");
const logger_1 = __importDefault(require("../utils/logger"));
const auditLogger_1 = require("../utils/auditLogger");
class ContentController {
    /**
     * Get all published content with pagination
     */
    async getAllPublishedContent(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const type = req.query.type;
            const content = await Content_1.default.findPublished(pagination.limit, pagination.offset, type);
            const totalCount = await Content_1.default.countPublished(type);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(content, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting published content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve content');
        }
    }
    /**
     * Get content by type with pagination
     */
    async getContentByType(req, res) {
        try {
            const { type } = req.params;
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const content = await Content_1.default.findByType(type, pagination.limit, pagination.offset, true // published only for public routes
            );
            const totalCount = await Content_1.default.countByType(type, true);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(content, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error(`Error getting content by type ${req.params.type}:`, error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve content');
        }
    }
    /**
     * Get content by ID
     */
    async getContentById(req, res) {
        try {
            const { id } = req.params;
            const content = await Content_1.default.findById(parseInt(id));
            if (!content) {
                return res.status(404).json({ message: 'Content not found' });
            }
            // For public routes, only return published content
            if (!content.is_published) {
                return res.status(404).json({ message: 'Content not found' });
            }
            return res.status(200).json({ content });
        }
        catch (error) {
            logger_1.default.error('Error getting content by ID:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve content');
        }
    }
    /**
     * Get all content (admin only)
     */
    async getAllContent(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const type = req.query.type;
            const isPublished = req.query.is_published === 'true' ? true :
                req.query.is_published === 'false' ? false : undefined;
            const content = await Content_1.default.findAll(pagination.limit, pagination.offset, type, isPublished);
            const totalCount = await Content_1.default.countAll(type, isPublished);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(content, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting all content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve content');
        }
    }
    /**
     * Create new content (admin only)
     */
    async createContent(req, res) {
        try {
            const userId = req.user.id;
            const contentData = {
                ...req.body,
                created_by: userId,
                updated_by: userId
            };
            const content = await Content_1.default.create(contentData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'content',
                record_id: content.id,
                new_values: contentData,
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Content created successfully',
                content
            });
        }
        catch (error) {
            logger_1.default.error('Error creating content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to create content');
        }
    }
    /**
     * Update content (admin only)
     */
    async updateContent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original content for audit logging
            const originalContent = await Content_1.default.findById(parseInt(id));
            if (!originalContent) {
                return res.status(404).json({ message: 'Content not found' });
            }
            const contentData = {
                ...req.body,
                updated_by: userId,
                updated_at: new Date()
            };
            const updatedContent = await Content_1.default.update(parseInt(id), contentData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'content',
                record_id: parseInt(id),
                old_values: originalContent,
                new_values: updatedContent,
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Content updated successfully',
                content: updatedContent
            });
        }
        catch (error) {
            logger_1.default.error('Error updating content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update content');
        }
    }
    /**
     * Publish content (admin only)
     */
    async publishContent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original content for audit logging
            const originalContent = await Content_1.default.findById(parseInt(id));
            if (!originalContent) {
                return res.status(404).json({ message: 'Content not found' });
            }
            const updatedContent = await Content_1.default.updatePublishStatus(parseInt(id), true, userId);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'content',
                record_id: parseInt(id),
                old_values: { is_published: originalContent.is_published },
                new_values: { is_published: true },
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Content published successfully',
                content: updatedContent
            });
        }
        catch (error) {
            logger_1.default.error('Error publishing content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to publish content');
        }
    }
    /**
     * Unpublish content (admin only)
     */
    async unpublishContent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original content for audit logging
            const originalContent = await Content_1.default.findById(parseInt(id));
            if (!originalContent) {
                return res.status(404).json({ message: 'Content not found' });
            }
            const updatedContent = await Content_1.default.updatePublishStatus(parseInt(id), false, userId);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'content',
                record_id: parseInt(id),
                old_values: { is_published: originalContent.is_published },
                new_values: { is_published: false },
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Content unpublished successfully',
                content: updatedContent
            });
        }
        catch (error) {
            logger_1.default.error('Error unpublishing content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to unpublish content');
        }
    }
    /**
     * Delete content (admin only)
     */
    async deleteContent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original content for audit logging
            const content = await Content_1.default.findById(parseInt(id));
            if (!content) {
                return res.status(404).json({ message: 'Content not found' });
            }
            await Content_1.default.delete(parseInt(id));
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'content',
                record_id: parseInt(id),
                old_values: content,
                ip_address: req.ip
            });
            return res.status(200).json({ message: 'Content deleted successfully' });
        }
        catch (error) {
            logger_1.default.error('Error deleting content:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to delete content');
        }
    }
    /**
     * Upload gallery images (admin only)
     */
    async uploadGalleryImage(req, res) {
        try {
            const userId = req.user.id;
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            // Create gallery content entry
            const contentData = {
                title: req.body.title || req.file.originalname,
                type: 'gallery',
                content: JSON.stringify({
                    file_path: req.file.path,
                    original_name: req.file.originalname,
                    mime_type: req.file.mimetype,
                    size: req.file.size
                }),
                created_by: userId,
                updated_by: userId,
                is_published: req.body.is_published === 'true'
            };
            const content = await Content_1.default.create(contentData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'content',
                record_id: content.id,
                new_values: contentData,
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Gallery image uploaded successfully',
                content
            });
        }
        catch (error) {
            logger_1.default.error('Error uploading gallery image:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to upload gallery image');
        }
    }
    /**
     * Get featured blog posts
     */
    async getFeaturedBlogPosts(req, res) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 3;
            const featuredPosts = await Content_1.default.findFeaturedBlogPosts(limit);
            return res.status(200).json({ featuredPosts });
        }
        catch (error) {
            logger_1.default.error('Error getting featured blog posts:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve featured blog posts');
        }
    }
    /**
     * Get FAQ categories
     */
    async getFaqCategories(req, res) {
        try {
            const categories = await Content_1.default.getFaqCategories();
            return res.status(200).json({ categories });
        }
        catch (error) {
            logger_1.default.error('Error getting FAQ categories:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve FAQ categories');
        }
    }
}
exports.default = new ContentController();
//# sourceMappingURL=ContentController.js.map