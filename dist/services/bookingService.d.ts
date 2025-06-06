export interface Booking {
    id: string;
    userId: string;
    vehicleId: string;
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    clientName?: string;
    serviceName?: string;
    serviceDescription?: string;
}
export interface CreateBookingData {
    userId: string;
    vehicleId: string;
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
}
export interface UpdateBookingData {
    scheduledDate?: string;
    scheduledTime?: string;
    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
}
export declare const getAllBookings: () => Promise<Booking[]>;
export declare const getMyBookings: () => Promise<Booking[]>;
export declare const getBookingById: (id: string) => Promise<Booking>;
export declare const createBooking: (data: CreateBookingData) => Promise<Booking>;
export declare const updateBooking: (id: string, data: UpdateBookingData) => Promise<Booking>;
export declare const cancelBooking: (id: string) => Promise<Booking>;
export declare const deleteBooking: (id: string) => Promise<{
    message: string;
}>;
