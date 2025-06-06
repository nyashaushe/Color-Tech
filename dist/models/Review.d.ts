interface Review {
    id: number;
    user_id: number;
    service_id: number;
    booking_id?: number;
    rating: number;
    title: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: Date;
    updated_at: Date;
}
interface ReviewInput {
    user_id: number;
    service_id: number;
    booking_id?: number;
    rating: number;
    title: string;
    content: string;
    status?: 'pending' | 'approved' | 'rejected';
}
declare class ReviewModel {
    /**
     * Find all public (approved) reviews with pagination
     */
    findPublic(limit: number, offset: number): Promise<Review[]>;
    /**
     * Count public reviews for pagination
     */
    countPublic(): Promise<number>;
    /**
     * Find reviews by service ID with pagination
     */
    findByServiceId(serviceId: number, limit: number, offset: number): Promise<Review[]>;
    /**
     * Count reviews by service ID for pagination
     */
    countByServiceId(serviceId: number): Promise<number>;
    /**
     * Find reviews by user ID with pagination
     */
    findByUserId(userId: number, limit: number, offset: number): Promise<Review[]>;
    /**
     * Count reviews by user ID for pagination
     */
    countByUserId(userId: number): Promise<number>;
    /**
     * Find all reviews with pagination (admin only)
     */
    findAll(limit: number, offset: number, status?: string): Promise<Review[]>;
    /**
     * Count all reviews for pagination (admin only)
     */
    countAll(status?: string): Promise<number>;
    /**
     * Find review by ID
     */
    findById(id: number): Promise<Review | null>;
    /**
     * Create a new review
     */
    create(reviewData: ReviewInput): Promise<Review>;
    /**
     * Update a review
     */
    update(id: number, reviewData: Partial<ReviewInput>): Promise<Review | null>;
    /**
     * Update review status
     */
    updateStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Review | null>;
    /**
     * Delete a review
     */
    delete(id: number): Promise<boolean>;
}
declare const _default: ReviewModel;
export default _default;
