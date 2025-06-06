export interface Review {
    id: string;
    userId: string;
    serviceId: string;
    rating: number;
    comment: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    userName?: string;
    serviceName?: string;
}
export interface CreateReviewData {
    serviceId: string;
    rating: number;
    comment: string;
}
export interface UpdateReviewData {
    rating?: number;
    comment?: string;
    status?: 'pending' | 'approved' | 'rejected';
}
export declare const getAllReviews: () => Promise<Review[]>;
export declare const getMyReviews: () => Promise<Review[]>;
export declare const getReviewById: (id: string) => Promise<Review>;
export declare const createReview: (data: CreateReviewData) => Promise<Review>;
export declare const updateReview: (id: string, data: UpdateReviewData) => Promise<Review>;
export declare const deleteReview: (id: string) => Promise<{
    message: string;
}>;
