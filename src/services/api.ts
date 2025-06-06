import axios from 'axios';
import { config } from './config';
import jwtConfig from '../lib/jwt';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 15000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    // Add auth token to requests using centralized JWT configuration
    const token = jwtConfig.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    // Log error details
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and redirect to login using centralized JWT configuration
      jwtConfig.removeToken();
      localStorage.removeItem('user');
      
      // If we're not already on the login page, redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Check if we're in a Node.js environment
const isNode = typeof window === 'undefined';

if (isNode) {
  // Node.js specific code
}

export default api; 