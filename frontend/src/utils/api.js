import axios from 'axios';

const api = axios.create({
  baseURL: 'https://student-management-system-backend-pdb4.onrender.com' || 'http://localhost:5000', // Proxy handles request to onrender
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      // originalRequest._retry = true; 
      // Handle refresh token logic here if implementing silent refresh 
      // For this implementation, we might redirect to login if 401
    }
    return Promise.reject(error);
  }
);

export default api;
