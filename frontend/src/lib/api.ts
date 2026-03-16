import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('siparim_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('siparim_token');
      localStorage.removeItem('siparim_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Restaurants
export const restaurantsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/restaurants', { params }),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  getMenu: (id: string) => api.get(`/restaurants/${id}/menu`),
  create: (data: FormData) =>
    api.post('/restaurants', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: Partial<{ name: string; description: string; isOpen: boolean }>) =>
    api.put(`/restaurants/${id}`, data),
  getDashboard: () => api.get('/restaurants/me/dashboard'),
};

// Menu
export const menuApi = {
  getItems: (restaurantId: string) => api.get(`/restaurants/${restaurantId}/menu`),
  createItem: (restaurantId: string, data: FormData) =>
    api.post(`/restaurants/${restaurantId}/menu`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateItem: (restaurantId: string, itemId: string, data: object) =>
    api.put(`/restaurants/${restaurantId}/menu/${itemId}`, data),
  deleteItem: (restaurantId: string, itemId: string) =>
    api.delete(`/restaurants/${restaurantId}/menu/${itemId}`),
};

// Orders
export const ordersApi = {
  create: (data: object) => api.post('/orders', data),
  getMyOrders: (params?: { page?: number; limit?: number }) =>
    api.get('/orders/my', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  getRestaurantOrders: (params?: { status?: string; page?: number }) =>
    api.get('/orders/restaurant', { params }),
  getAllOrders: (params?: { status?: string; page?: number }) =>
    api.get('/orders/admin/all', { params }),
  updateStatus: (id: string, status: string, preparationTime?: number) =>
    api.put(`/orders/${id}/status`, { status, preparationTime }),
  applyPromo: (code: string, subtotal: number) =>
    api.post('/orders/promo/validate', { code, subtotal }),
};

// Users / Profile
export const profileApi = {
  update: (data: object) => api.put('/profile', data),
  addAddress: (address: object) => api.post('/profile/addresses', address),
  deleteAddress: (id: string) => api.delete(`/profile/addresses/${id}`),
  setDefaultAddress: (id: string) => api.put(`/profile/addresses/${id}/default`),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPendingRestaurants: () => api.get('/admin/restaurants/pending'),
  approveRestaurant: (id: string) => api.put(`/admin/restaurants/${id}/approve`),
  rejectRestaurant: (id: string, reason: string) =>
    api.put(`/admin/restaurants/${id}/reject`, { reason }),
  getPendingCouriers: () => api.get('/admin/couriers/pending'),
  approveCourier: (id: string) => api.put(`/admin/couriers/${id}/approve`),
  rejectCourier: (id: string) => api.put(`/admin/couriers/${id}/reject`),
  getAllOrders: (params?: object) => api.get('/admin/orders', { params }),
};

// Earnings
export const earningsApi = {
  getReport: (params?: { period?: string; startDate?: string; endDate?: string }) =>
    api.get('/restaurants/me/earnings', { params }),
};
