import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://pos.idotsolution.com/api',
  // baseURL: "http://localhost:5000/api",
  baseURL: "http://192.168.100.7:45461/api",
  // ...existing code...
});



export const getCategories = () => api.get('/Setting/categories'); // Fixed endpoint path
export const createCategory = (data) => api.post('/Setting/categories', data); // Fixed endpoint path
export const deleteCategory = (id,data) => api.post(`/Setting/categories/${id}`,data); // Fixed endpoint path

export const getSubCategories = () => api.get('/Setting/subCategories'); // Fixed endpoint path
export const createSubCategory = (data) => api.post('/Setting/subCategories', data); // Fixed endpoint path
export const deleteSubCategory = (id,data) => api.post(`/Setting/subCategories/${id}`,data); // Fixed endpoint path

export default api;