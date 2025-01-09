import axios from "axios";
import { BASE_URL } from "../Constants/index";
import { toast } from 'react-toastify';

// Debug log
console.log('Creating axios instance with baseURL:', BASE_URL);

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    try {
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
      
      const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
      console.log('Is public route:', isPublicRoute);
      
      // Get token from session storage
      const token = sessionStorage.getItem('token');
      
      // Add auth header if route requires authentication
      if (!isPublicRoute && token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Added auth token to request');
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      console.log('Response received:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
      return response;
    } catch (error) {
      console.error('Response interceptor error:', error);
      return Promise.reject(error);
    }
  },
  async (error) => {
    try {
      const originalRequest = error.config;
      console.error('Response error:', {
        status: error?.response?.status,
        url: error?.config?.url,
        message: error?.response?.data?.message || error.message
      });
      
      // Handle token expiration
      if (error?.response?.status === 401 && error?.response?.data?.message?.includes('expired')) {
        if (!isRefreshing) {
          isRefreshing = true;
          
          try {
            // Try to refresh the token
            const response = await axiosInstance.post('/users/refresh-token');
            const newToken = response.data.token;
            
            if (newToken) {
              // Update session storage with new token
              sessionStorage.setItem('token', newToken);
              
              // Update the original request with new token
              originalRequest.headers = {
                ...originalRequest.headers,
                'Authorization': `Bearer ${newToken}`
              };
              
              // Process all queued requests with new token
              processQueue(null, newToken);
              
              // Retry the original request
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            // If refresh token fails, clear session and redirect to login
            sessionStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // If refresh is already in progress, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers = {
              ...originalRequest.headers,
              'Authorization': `Bearer ${token}`
            };
            return axiosInstance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }
      }
      
      // For other 401 errors related to authentication
      if (error?.response?.status === 401 && 
          (error?.config?.url?.includes('/users/login') || 
           error?.config?.url?.includes('/users/refresh-token'))) {
        sessionStorage.clear();
        window.location.href = '/login';
      }
      
      // Show error message to user
      const errorMessage = error?.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
      
      return Promise.reject(error);
    } catch (error) {
      console.error('Response interceptor error:', error);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
