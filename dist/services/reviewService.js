"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviewById = exports.getMyReviews = exports.getAllReviews = void 0;
const api_1 = __importDefault(require("./api"));
// Get all reviews (admin)
const getAllReviews = async () => {
    const response = await api_1.default.get('/reviews');
    return response.data;
};
exports.getAllReviews = getAllReviews;
// Get reviews for current user
const getMyReviews = async () => {
    const response = await api_1.default.get('/reviews/my-reviews');
    return response.data;
};
exports.getMyReviews = getMyReviews;
// Get review by ID
const getReviewById = async (id) => {
    const response = await api_1.default.get(`/reviews/${id}`);
    return response.data;
};
exports.getReviewById = getReviewById;
// Create new review
const createReview = async (data) => {
    const response = await api_1.default.post('/reviews', data);
    return response.data;
};
exports.createReview = createReview;
// Update review
const updateReview = async (id, data) => {
    const response = await api_1.default.put(`/reviews/${id}`, data);
    return response.data;
};
exports.updateReview = updateReview;
// Delete review
const deleteReview = async (id) => {
    const response = await api_1.default.delete(`/reviews/${id}`);
    return response.data;
};
exports.deleteReview = deleteReview;
//# sourceMappingURL=reviewService.js.map