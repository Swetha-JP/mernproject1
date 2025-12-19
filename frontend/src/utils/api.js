import axios from 'axios';
import { storage } from './helpers';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token and CSRF protection
api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = storage.get('csrf_token') || 'default-csrf-token';
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      storage.remove('token');
      storage.remove('user_data');
      
      if (window.location.pathname !== '/') {
        console.warn('Session expired. Please login again.');
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  validateToken: () => api.get('/auth/validate'),
};

// Utility to check if token is valid
export const isTokenValid = () => {
  const token = storage.get('token');
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  updateUserStatus: (id, status) => api.put(`/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const transactionAPI = {
  createRecharge: (data) => api.post('/transactions/recharge', data),
  getMyTransactions: (params) => api.get('/transactions/my-transactions', { params }),
  getAllTransactions: (params) => api.get('/transactions', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  retryTransaction: (id) => api.put(`/transactions/${id}/retry`),
};

export const operatorAPI = {
  getOperators: (params) => api.get('/operators', { params }),
  createOperator: (data) => api.post('/operators', data),
  updateOperator: (id, data) => api.put(`/operators/${id}`, data),
  deleteOperator: (id) => api.delete(`/operators/${id}`),
};

export const planAPI = {
  getPlans: (params) => api.get('/plans', { params }),
  createPlan: (data) => api.post('/plans', data),
  updatePlan: (id, data) => api.put(`/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export const offerAPI = {
  getOffers: (params) => api.get('/offers', { params }),
  validateOffer: (data) => api.post('/offers/validate', data),
  createOffer: (data) => api.post('/offers', data),
  updateOffer: (id, data) => api.put(`/offers/${id}`, data),
  deleteOffer: (id) => api.delete(`/offers/${id}`),
};

export default api;