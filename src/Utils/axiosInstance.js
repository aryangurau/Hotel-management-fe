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
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });

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
      // Set token in access_token header
      config.headers.access_token = token;
    } else if (!isPublicRoute) {
      // If no token and not a public route, throw error
      throw new Error('No access token found');
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Handle network errors
    if (!error.response) {
      console.error('Network error details:', error);
      return Promise.reject(new Error('Network error. Please check if the server is running and accessible.'));
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      removeAll();
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please login again.'));
    }

    // Handle 500 Server Error
    if (error.response.status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Handle other errors
    const errorMessage = error.response?.data?.msg || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);
