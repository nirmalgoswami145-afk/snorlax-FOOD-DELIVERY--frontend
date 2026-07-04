import axios from 'axios';

const API_BASE_URL = "https://food-delivery-backend-production-7afc.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post(`/auth/login?email=${email}&password=${password}`),
};

export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (name, address) => api.post(`/restaurants?name=${name}&address=${address}`),
};

export const menuService = {
  getMenu: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu`),
  addItem: (restaurantId, name, description, price) =>
    api.post(`/restaurants/${restaurantId}/menu?name=${name}&description=${description}&price=${price}`),
};

export const orderService = {
  placeOrder: (restaurantId, items) => api.post(`/orders?restaurantId=${restaurantId}`, items),
  getMyOrders: () => api.get('/orders/my-orders'),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status?status=${status}`),
};

export default api; 