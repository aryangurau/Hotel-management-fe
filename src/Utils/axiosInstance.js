import axios from "axios";
import { BASE_URL } from "../Constants/index";

// Debug log
console.log('Creating axios instance with baseURL:', BASE_URL);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request URL and method
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    // Define public routes that don't need authentication
    const publicRoutes = [
      '/users/login',
      '/users/register',
      '/users/verify',
      '/users/forget-password',
      '/users/verify-forget-password',
      '/rooms/public'
    ];
    
    // Check if the current request URL is a public route
    const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
    console.log('Is public route:', isPublicRoute);
    
    // Get token directly from session storage
    const token = sessionStorage.getItem('token');
    console.log('Token found:', token ? 'Yes' : 'No');
    
    if (token) {
      // Set token in Authorization header with Bearer prefix
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else if (!isPublicRoute) {
      // Only reject if it's not a public route and we don't have a token
      console.log('No token found for protected route');
      return Promise.reject(new Error('No access token found'));
    }
    
    // Log final request config
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      hasToken: !!config.headers.Authorization
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error?.response?.status,
      url: error?.config?.url,
      message: error?.response?.data?.message || error.message
    });
    
    // Handle 401 errors
    if (error?.response?.status === 401) {
      // Clear session storage
      sessionStorage.clear();
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
