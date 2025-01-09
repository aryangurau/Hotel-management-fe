import axios from "axios";
import { BASE_URL } from "../Constants/index";
import { getToken, removeAll } from "./session";

// Debug log
console.log('Creating axios instance with baseURL:', BASE_URL);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    
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
    const isPublicRoute = config.url && publicRoutes.some(route => config.url.includes(route));
    
    if (token) {
      // Set token in Authorization header
      config.headers.authorization = `Bearer ${token}`;
    } else if (!isPublicRoute) {
      throw new Error('No token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear session data
      removeAll();
      
      // Store current path for redirect after login
      const currentPath = window.location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      
      // Only redirect if not already on login page
      if (currentPath !== '/login') {
        window.location.href = `/login?returnUrl=${returnUrl}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
