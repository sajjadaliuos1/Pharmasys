import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://pos.idotsolution.com/api',
 
  baseURL: "https://192.168.100.7:45457/api",
  // ...existing code...
});

// API methods for investors
export const CategoriesDetails = () => api.get('/Setting/categories'); // Fixed endpoint path
 // Fixed endpoint path

export default api;