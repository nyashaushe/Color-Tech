import { Request, Response } from 'express';
declare class BookingController {
    /**
     * Get all bookings (admin/staff only)
     */
    getAllBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get bookings for the authenticated user
     */
    getMyBookings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get booking by ID
     */
    getBookingById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new booking
     */
    createBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update booking (user can only update pending bookings)
     */
    updateBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Cancel booking (user can only cancel pending bookings)
     */
    cancelBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete booking (admin only)
     */
    deleteBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get available time slots for a specific date
     */
    getAvailableTimeSlots(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get booking statistics (admin/staff only)
     */
    getBookingStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: BookingController;
export default _default;
