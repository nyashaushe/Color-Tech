export interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    category: string;
    status: 'draft' | 'published' | 'archived';
    publishDate: string;
    imageUrl: string;
    readTime: string;
}
export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    category: string;
    type: 'before-after' | 'showcase';
    beforeImage?: string;
    afterImage?: string;
    image?: string;
    uploadDate: string;
}
export declare const contentService: {
    getBlogPosts(): Promise<BlogPost[]>;
    createBlogPost(post: Omit<BlogPost, "id">): Promise<BlogPost>;
    updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
    deleteBlogPost(id: string): Promise<void>;
    getGalleryItems(): Promise<GalleryItem[]>;
    uploadGalleryItem(formData: FormData): Promise<GalleryItem>;
    deleteGalleryItem(id: string): Promise<void>;
};
