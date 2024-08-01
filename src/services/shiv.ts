// api.js
import axios from 'axios';

// Create an Axios instance
const baseURL = 'https://shiv-fast-food-backend-wuq9.onrender.com';
const apiClient = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardData = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await apiClient.get('/api/v1/order/all-orders');
  return response.data;
};

export const getActiveOrders = async () => {
  const response = await apiClient.get('/api/v1/order/get-active-order');
  return response.data;
};
export const getAcceptedOrders = async () => {
  const response = await apiClient.get('/api/v1/order/get-accepted-order');
  return response.data;
};

export const getDeliveredOrders = async () => {
  const response = await apiClient.get('/api/v1/order/get-delivered-order');
  return response.data;
};

export const updateOrderStatus = async (orderId: any, status: any) => {
  const response = await apiClient.post('/api/v1/order/update-order-status', {
    orderId,
    status,
  });
  return response.data;
};
export const updateKitchenStatus = async (kitchenStatus: any) => {
  const response = await apiClient.patch('/api/v1/kitchen/update-status', {
    kitchenStatus,
  });
  return response.data;
};

export const getKitchenStatus = async () => {
  const response = await apiClient.get('/api/v1/kitchen');
  return response.data;
};

export const getMenu = async () => {
  const response = await apiClient.get('/api/v1/menu/get-item');
  return response.data;
};

export const updateMenu = async (id: any, price: any, availability: any) => {
  const response = await apiClient.patch('/api/v1/menu/update-item', {
    id,
    price,
    availability,
  });
  return response.data;
};
