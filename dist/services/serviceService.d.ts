export interface Service {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    durationMinutes: number;
    category: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}
export interface CreateServiceData {
    name: string;
    description: string;
    basePrice: number;
    durationMinutes: number;
    category: string;
}
export interface UpdateServiceData {
    name?: string;
    description?: string;
    basePrice?: number;
    durationMinutes?: number;
    category?: string;
    status?: 'active' | 'inactive';
}
export declare const getAllServices: () => Promise<Service[]>;
export declare const getServiceById: (id: string) => Promise<Service>;
export declare const createService: (data: CreateServiceData) => Promise<Service>;
export declare const updateService: (id: string, data: UpdateServiceData) => Promise<Service>;
export declare const deleteService: (id: string) => Promise<{
    message: string;
    service?: Service;
}>;
