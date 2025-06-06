export interface User {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'client' | 'staff';
    phone: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date | null;
}
export interface CreateUserData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'client' | 'staff';
    phone: string | null;
    is_active: boolean;
}
export interface UpdateUserData {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    role?: 'admin' | 'client' | 'staff';
    phone?: string | null;
    is_active?: boolean;
}
declare class UserModel {
    /**
     * Find user by ID
     */
    findById(id: number): Promise<User | null>;
    /**
     * Find user by email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Find all users with pagination
     */
    findAll(limit?: number, offset?: number): Promise<User[]>;
    /**
     * Count all users
     */
    countAll(): Promise<number>;
    /**
     * Create a new user
     */
    create(userData: CreateUserData): Promise<number>;
    /**
     * Update user
     */
    update(id: number, userData: UpdateUserData): Promise<boolean>;
    /**
     * Delete user
     */
    delete(id: number): Promise<boolean>;
    /**
     * Update last login timestamp
     */
    updateLastLogin(id: number): Promise<boolean>;
}
declare const _default: UserModel;
export default _default;
