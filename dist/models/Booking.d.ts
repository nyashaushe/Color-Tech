export interface Booking {
    id: number;
    user_id: number;
    vehicle_id: number;
    booking_date: Date;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    total_price: number;
    notes?: string;
    created_at: Date;
    updated_at: Date;
    client_name?: string;
    service_name?: string;
    service_description?: string;
}
export interface CreateBookingData {
    user_id: number;
    vehicle_id: number;
    booking_date: Date;
    start_time: string;
    end_time: string;
    total_price: number;
    notes?: string;
}
export interface UpdateBookingData {
    booking_date?: Date;
    start_time?: string;
    end_time?: string;
    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    total_price?: number;
    staff_id?: number;
    notes?: string;
}
export interface BookingFilter {
    status?: string;
    date?: string;
    staffId?: number;
}
export interface BookingStatistics {
    total: number;
    by_status: {
        pending: number;
        confirmed: number;
        in_progress: number;
        completed: number;
        cancelled: number;
    };
    by_date: {
        date: string;
        count: number;
    }[];
    revenue: {
        total: number;
        average_per_booking: number;
    };
}
declare class BookingModel {
    /**
     * Create a new booking
     */
    create(data: CreateBookingData): Promise<number>;
    /**
     * Find booking by ID with joined data
     */
    findById(id: number): Promise<Booking | null>;
    /**
     * Find bookings by user ID
     */
    findByUserId(userId: number, limit?: number, offset?: number, status?: string): Promise<Booking[]>;
    /**
     * Count bookings by user ID
     */
    countByUserId(userId: number, status?: string): Promise<number>;
    /**
     * Find all bookings with pagination and filtering
     */
    findAll(limit?: number, offset?: number, filter?: BookingFilter): Promise<Booking[]>;
    /**
     * Count all bookings with filtering
     */
    countAll(filter?: BookingFilter): Promise<number>;
    /**
     * Update booking
     */
    update(id: number, data: UpdateBookingData): Promise<boolean>;
    /**
     * Delete booking
     */
    delete(id: number): Promise<boolean>;
    /**
     * Add service to booking
     */
    addService(bookingId: number, serviceId: number, quantity: number | undefined, price: number): Promise<number>;
    /**
     * Remove service from booking
     */
    removeService(bookingId: number, serviceId: number): Promise<boolean>;
    /**
     * Get services for a booking
     */
    getBookingServices(bookingId: number): Promise<any[]>;
    /**
     * Update booking total price based on services
     */
    private updateBookingTotal;
    /**
     * Get booking statistics
     */
    getStatistics(startDate?: string, endDate?: string): Promise<BookingStatistics>;
}
declare const _default: BookingModel;
export default _default;
