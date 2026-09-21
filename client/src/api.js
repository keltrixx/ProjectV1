import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any axios error into a readable message
export const errMsg = (err) => err.response?.data?.message || err.message || 'Something went wrong.';

export default api;
