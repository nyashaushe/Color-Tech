import { Request, Response } from 'express';
interface RequestWithFile extends Request {
    file?: Express.Multer.File;
}
declare class ContentController {
    /**
     * Get all published content with pagination
     */
    getAllPublishedContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get content by type with pagination
     */
    getContentByType(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get content by ID
     */
    getContentById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all content (admin only)
     */
    getAllContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create new content (admin only)
     */
    createContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update content (admin only)
     */
    updateContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Publish content (admin only)
     */
    publishContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Unpublish content (admin only)
     */
    unpublishContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete content (admin only)
     */
    deleteContent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Upload gallery images (admin only)
     */
    uploadGalleryImage(req: RequestWithFile, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get featured blog posts
     */
    getFeaturedBlogPosts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get FAQ categories
     */
    getFaqCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ContentController;
export default _default;
