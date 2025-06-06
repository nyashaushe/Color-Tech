"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentService = void 0;
const api_1 = __importDefault(require("./api"));
exports.contentService = {
    // Blog Management
    async getBlogPosts() {
        const response = await api_1.default.get('/blog-posts');
        return response.data;
    },
    async createBlogPost(post) {
        const response = await api_1.default.post('/blog-posts', post);
        return response.data;
    },
    async updateBlogPost(id, post) {
        const response = await api_1.default.put(`/blog-posts/${id}`, post);
        return response.data;
    },
    async deleteBlogPost(id) {
        await api_1.default.delete(`/blog-posts/${id}`);
    },
    // Gallery Management
    async getGalleryItems() {
        const response = await api_1.default.get('/gallery');
        return response.data;
    },
    async uploadGalleryItem(formData) {
        const response = await api_1.default.post('/gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    async deleteGalleryItem(id) {
        await api_1.default.delete(`/gallery/${id}`);
    }
};
//# sourceMappingURL=contentService.js.map