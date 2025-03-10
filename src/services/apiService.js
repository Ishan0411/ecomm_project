// src/services/apiService.js
import axios from 'axios';

// Create base API instance
const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1/categories.php', // Replace with your actual API base URL
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor to handle CommonResponse format
api.interceptors.response.use(
  (response) => {
    const commonResponse = response.data;
    
    // Validate the CommonResponse format
    if (commonResponse === null || typeof commonResponse !== 'object') {
      return Promise.reject(new Error('Invalid response format'));
    }
    
    //Check if request was successful based on the success flag
    if (!commonResponse.success) {
      return Promise.reject(new Error(commonResponse.message || 'Request failed'));
    }
    
    // If statusCode indicates an error
    if (commonResponse.statusCode >= 400) {
      return Promise.reject(new Error(commonResponse.message || `HTTP Error: ${commonResponse.statusCode}`));
    }
    
    // Return the standardized response
    return commonResponse;
  },
  (error) => {
    // Handle network errors, timeouts, etc.
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      return Promise.reject(new Error(error.response.data?.message || `Server error: ${error.response.status}`));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something else happened while setting up the request
      return Promise.reject(error);
    }
  }
);

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;