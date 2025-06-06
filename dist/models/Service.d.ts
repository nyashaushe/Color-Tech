export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    category_id: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    category_name?: string;
}
export interface ServiceInput {
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    category_id: number;
    is_active?: boolean;
}
export interface ServiceCategory {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}
export interface ServiceCategoryInput {
    name: string;
    description: string;
}
declare class ServiceModel {
    /**
     * Find all services with pagination and optional filtering
     */
    findAll(limit: number, offset: number, categoryId?: number, isActive?: boolean): Promise<Service[]>;
    /**
     * Count services with optional filtering
     */
    countServices(categoryId?: number, isActive?: boolean): Promise<number>;
    /**
     * Find service by ID
     */
    findById(id: number): Promise<Service | null>;
    /**
     * Create a new service
     */
    create(serviceData: ServiceInput): Promise<Service>;
    /**
     * Update a service
     */
    update(id: number, serviceData: Partial<ServiceInput>): Promise<Service | null>;
    /**
     * Delete a service
     */
    delete(id: number): Promise<boolean>;
    /**
     * Get all service categories
     */
    getCategories(): Promise<ServiceCategory[]>;
    /**
     * Find category by ID
     */
    findCategoryById(id: number): Promise<ServiceCategory | null>;
    /**
     * Create a new service category
     */
    createCategory(categoryData: ServiceCategoryInput): Promise<ServiceCategory>;
    /**
     * Update a service category
     */
    updateCategory(id: number, categoryData: Partial<ServiceCategoryInput>): Promise<ServiceCategory | null>;
    /**
     * Delete a service category
     */
    deleteCategory(id: number): Promise<boolean>;
}
declare const _default: ServiceModel;
export default _default;
