"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Review_1 = __importDefault(require("../models/Review"));
const errorHandler_1 = require("../utils/errorHandler");
const pagination_1 = require("../utils/pagination");
const logger_1 = __importDefault(require("../utils/logger"));
const auditLogger_1 = require("../utils/auditLogger");
class ReviewController {
    /**
     * Get all public reviews with pagination
     */
    async getPublicReviews(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const reviews = await Review_1.default.findPublic(pagination.limit, pagination.offset);
            const totalCount = await Review_1.default.countPublic();
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(reviews, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting public reviews:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve reviews');
        }
    }
    /**
     * Get reviews by service ID with pagination
     */
    async getReviewsByServiceId(req, res) {
        try {
            const { serviceId } = req.params;
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const reviews = await Review_1.default.findByServiceId(parseInt(serviceId), pagination.limit, pagination.offset);
            const totalCount = await Review_1.default.countByServiceId(parseInt(serviceId));
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(reviews, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting reviews by service ID:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve reviews for this service');
        }
    }
    /**
     * Get reviews by the authenticated user
     */
    async getMyReviews(req, res) {
        try {
            const userId = req.user.id;
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const reviews = await Review_1.default.findByUserId(userId, pagination.limit, pagination.offset);
            const totalCount = await Review_1.default.countByUserId(userId);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(reviews, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting user reviews:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve your reviews');
        }
    }
    /**
     * Get all reviews (admin only)
     */
    async getAllReviews(req, res) {
        try {
            const pagination = (0, pagination_1.getPaginationParams)(req);
            const status = req.query.status;
            const reviews = await Review_1.default.findAll(pagination.limit, pagination.offset, status);
            const totalCount = await Review_1.default.countAll(status);
            const paginationMetadata = (0, pagination_1.addPaginationMetadata)(pagination, totalCount);
            return res.status(200).json((0, pagination_1.paginatedResponse)(reviews, paginationMetadata));
        }
        catch (error) {
            logger_1.default.error('Error getting all reviews:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to retrieve reviews');
        }
    }
    /**
     * Create a new review
     */
    async createReview(req, res) {
        try {
            const userId = req.user.id;
            const reviewData = {
                ...req.body,
                user_id: userId,
                status: 'pending' // Default status for new reviews
            };
            const review = await Review_1.default.create(reviewData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'insert',
                table_name: 'reviews',
                record_id: review.id,
                new_values: reviewData,
                ip_address: req.ip
            });
            return res.status(201).json({
                message: 'Review submitted successfully and pending approval',
                review
            });
        }
        catch (error) {
            logger_1.default.error('Error creating review:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to submit review');
        }
    }
    /**
     * Update a review (user can only update their own reviews)
     */
    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original review for audit logging and ownership check
            const originalReview = await Review_1.default.findById(parseInt(id));
            if (!originalReview) {
                return res.status(404).json({ message: 'Review not found' });
            }
            // Check if the user owns this review
            if (originalReview.user_id !== userId) {
                return res.status(403).json({ message: 'You can only update your own reviews' });
            }
            // Reset status to pending if content is changed
            const reviewData = {
                ...req.body,
                status: 'pending' // Reset to pending on update
            };
            const updatedReview = await Review_1.default.update(parseInt(id), reviewData);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'reviews',
                record_id: parseInt(id),
                old_values: originalReview,
                new_values: updatedReview,
                ip_address: req.ip
            });
            return res.status(200).json({
                message: 'Review updated successfully and pending approval',
                review: updatedReview
            });
        }
        catch (error) {
            logger_1.default.error('Error updating review:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update review');
        }
    }
    /**
     * Delete a review (user can only delete their own reviews)
     */
    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original review for audit logging and ownership check
            const review = await Review_1.default.findById(parseInt(id));
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            // Check if the user owns this review
            if (review.user_id !== userId) {
                return res.status(403).json({ message: 'You can only delete your own reviews' });
            }
            await Review_1.default.delete(parseInt(id));
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'reviews',
                record_id: parseInt(id),
                old_values: review,
                ip_address: req.ip
            });
            return res.status(200).json({ message: 'Review deleted successfully' });
        }
        catch (error) {
            logger_1.default.error('Error deleting review:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to delete review');
        }
    }
    /**
     * Update review status (admin only)
     */
    async updateReviewStatus(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { status } = req.body;
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status. Status must be pending, approved, or rejected'
                });
            }
            // Get the original review for audit logging
            const originalReview = await Review_1.default.findById(parseInt(id));
            if (!originalReview) {
                return res.status(404).json({ message: 'Review not found' });
            }
            const updatedReview = await Review_1.default.updateStatus(parseInt(id), status);
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'update',
                table_name: 'reviews',
                record_id: parseInt(id),
                old_values: { status: originalReview.status },
                new_values: { status },
                ip_address: req.ip
            });
            return res.status(200).json({
                message: `Review status updated to ${status}`,
                review: updatedReview
            });
        }
        catch (error) {
            logger_1.default.error('Error updating review status:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to update review status');
        }
    }
    /**
     * Delete a review (admin only)
     */
    async adminDeleteReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            // Get the original review for audit logging
            const review = await Review_1.default.findById(parseInt(id));
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            await Review_1.default.delete(parseInt(id));
            // Log the action
            await (0, auditLogger_1.createAuditLog)({
                user_id: userId,
                action: 'delete',
                table_name: 'reviews',
                record_id: parseInt(id),
                old_values: review,
                ip_address: req.ip,
                metadata: { admin_deletion: true, reason: 'Admin deletion' }
            });
            return res.status(200).json({ message: 'Review deleted successfully by admin' });
        }
        catch (error) {
            logger_1.default.error('Error admin deleting review:', error);
            return (0, errorHandler_1.handleServerError)(res, error, 'Failed to delete review');
        }
    }
}
exports.default = new ReviewController();
//# sourceMappingURL=ReviewController.js.map