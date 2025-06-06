import api from './api';
import { mockServices } from '../utils/mockData';

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

// Helper function to get mock services from localStorage
const getMockServices = (): Service[] => {
  if (typeof window !== 'undefined') {
    const storedServices = localStorage.getItem('mockServices');
    return storedServices ? JSON.parse(storedServices) : mockServices;
  }
  return mockServices;
};

// Helper function to save mock services to localStorage
const saveMockServices = (services: Service[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockServices', JSON.stringify(services));
  }
};

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.log('Using mock data for getAllServices');
    return getMockServices();
  }
};

// Get service by ID
export const getServiceById = async (id: string): Promise<Service> => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for getServiceById');
    const service = getMockServices().find(s => s.id === id);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  }
};

// Create new service (admin only)
export const createService = async (data: CreateServiceData): Promise<Service> => {
  try {
    const response = await api.post('/services', data);
    return response.data;
  } catch (error) {
    console.log('Using mock data for createService');
    const services = getMockServices();
    const newService: Service = {
      id: `mock-${Date.now()}`,
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedServices = [...services, newService];
    saveMockServices(updatedServices);
    
    return newService;
  }
};

// Update service (admin only)
export const updateService = async (id: string, data: UpdateServiceData): Promise<Service> => {
  try {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Using mock data for updateService');
    const services = getMockServices();
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      throw new Error('Service not found');
    }
    
    const updatedService = {
      ...services[serviceIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    services[serviceIndex] = updatedService;
    saveMockServices(services);
    
    return updatedService;
  }
};

// Delete service (admin only)
export const deleteService = async (id: string): Promise<{ message: string; service?: Service }> => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for deleteService');
    const services = getMockServices();
    const serviceToDelete = services.find(s => s.id === id);
    
    if (!serviceToDelete) {
      throw new Error('Service not found');
    }
    
    const filteredServices = services.filter(s => s.id !== id);
    saveMockServices(filteredServices);
    
    return { 
      message: 'Service deleted successfully',
      service: serviceToDelete
    };
  }
}; 