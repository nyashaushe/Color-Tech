import api from './api';
import { mockBookings } from '../utils/mockData';

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
  // Joined fields
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

// Helper function to get mock bookings from localStorage
const getMockBookings = (): Booking[] => {
  if (typeof window !== 'undefined') {
    const storedBookings = localStorage.getItem('mockBookings');
    return storedBookings ? JSON.parse(storedBookings) : mockBookings;
  }
  return mockBookings;
};

// Helper function to save mock bookings to localStorage
const saveMockBookings = (bookings: Booking[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockBookings', JSON.stringify(bookings));
  }
};

// Admin: Get all bookings
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.log('Using mock data for getAllBookings');
    return getMockBookings();
  }
};

// Client: Get current user's bookings
export const getMyBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  } catch (error) {
    console.log('Using mock data for getMyBookings');
    return getMockBookings();
  }
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking> => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for getBookingById');
    const booking = getMockBookings().find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }
};

// Create new booking
export const createBooking = async (data: CreateBookingData): Promise<Booking> => {
  try {
    const response = await api.post('/bookings', data);
    return response.data;
  } catch (error) {
    console.log('Using mock data for createBooking');
    
    // Get mock data for service name
    const mockServices = JSON.parse(localStorage.getItem('mockServices') || '[]');
    const service = mockServices.find((s: any) => s.id === data.serviceId);
    
    // Get mock data for vehicle
    const mockVehicles = JSON.parse(localStorage.getItem('mockVehicles') || '[]');
    const vehicle = mockVehicles.find((v: any) => v.id === data.vehicleId);
    
    const bookings = getMockBookings();
    const newBooking: Booking = {
      id: `mock-${Date.now()}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clientName: 'Current User',
      serviceName: service?.name || 'Unknown Service',
      serviceDescription: service?.description || ''
    };
    
    const updatedBookings = [...bookings, newBooking];
    saveMockBookings(updatedBookings);
    
    return newBooking;
  }
};

// Update booking
export const updateBooking = async (id: string, data: UpdateBookingData): Promise<Booking> => {
  try {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Using mock data for updateBooking');
    const bookings = getMockBookings();
    const bookingIndex = bookings.findIndex(b => b.id === id);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    const updatedBooking = {
      ...bookings[bookingIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    bookings[bookingIndex] = updatedBooking;
    saveMockBookings(bookings);
    
    return updatedBooking;
  }
};

// Cancel booking (client)
export const cancelBooking = async (id: string): Promise<Booking> => {
  return updateBooking(id, { status: 'cancelled' });
};

// Delete booking
export const deleteBooking = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for deleteBooking');
    const bookings = getMockBookings();
    const filteredBookings = bookings.filter(b => b.id !== id);
    
    if (filteredBookings.length === bookings.length) {
      throw new Error('Booking not found');
    }
    
    saveMockBookings(filteredBookings);
    
    return { message: 'Booking deleted successfully' };
  }
}; 