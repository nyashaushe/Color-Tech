interface Content {
    id: number;
    title: string;
    type: string;
    content: string;
    meta_description?: string;
    meta_keywords?: string;
    slug?: string;
    is_published: boolean;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    published_at?: Date;
}
interface ContentInput {
    title: string;
    type: string;
    content: string;
    meta_description?: string;
    meta_keywords?: string;
    slug?: string;
    is_published?: boolean;
    created_by: number;
    updated_by: number;
}
declare class ContentModel {
    /**
     * Find all published content with pagination and optional type filtering
     */
    findPublished(limit: number, offset: number, type?: string): Promise<Content[]>;
    /**
     * Count published content for pagination with optional type filtering
     */
    countPublished(type?: string): Promise<number>;
    /**
     * Find content by type with pagination
     */
    findByType(type: string, limit: number, offset: number, publishedOnly?: boolean): Promise<Content[]>;
    /**
     * Count content by type for pagination
     */
    countByType(type: string, publishedOnly?: boolean): Promise<number>;
    /**
     * Find content by ID
     */
    findById(id: number): Promise<Content | null>;
    /**
     * Find content by slug
     */
    findBySlug(slug: string): Promise<Content | null>;
    /**
     * Find all content with pagination and optional filtering (admin only)
     */
    findAll(limit: number, offset: number, type?: string, isPublished?: boolean): Promise<Content[]>;
    /**
     * Count all content for pagination with optional filtering (admin only)
     */
    countAll(type?: string, isPublished?: boolean): Promise<number>;
    /**
     * Create new content
     */
    create(contentData: ContentInput): Promise<Content>;
    /**
     * Update content
     */
    update(id: number, contentData: Partial<ContentInput>): Promise<Content | null>;
    /**
     * Update content publish status
     */
    updatePublishStatus(id: number, isPublished: boolean, updatedBy: number): Promise<Content | null>;
    /**
     * Delete content
     */
    delete(id: number): Promise<boolean>;
    /**
     * Find featured blog posts
     */
    findFeaturedBlogPosts(limit?: number): Promise<Content[]>;
    /**
     * Get FAQ categories
     */
    getFaqCategories(): Promise<any[]>;
    /**
     * Generate a URL-friendly slug from a title
     */
    private generateSlug;
}
declare const _default: ContentModel;
export default _default;
