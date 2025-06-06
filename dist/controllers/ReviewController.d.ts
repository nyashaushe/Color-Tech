import { Request, Response } from 'express';
declare class ReviewController {
    /**
     * Get all public reviews with pagination
     */
    getPublicReviews(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get reviews by service ID with pagination
     */
    getReviewsByServiceId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get reviews by the authenticated user
     */
    getMyReviews(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all reviews (admin only)
     */
    getAllReviews(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new review
     */
    createReview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update a review (user can only update their own reviews)
     */
    updateReview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a review (user can only delete their own reviews)
     */
    deleteReview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update review status (admin only)
     */
    updateReviewStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a review (admin only)
     */
    adminDeleteReview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ReviewController;
export default _default;
