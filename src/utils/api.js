import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/api` || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('Ошибка сети. Проверьте подключение.'));
    }

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
      return Promise.reject(new Error('Требуется авторизация. Пожалуйста, войдите.'));
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error || error.message || 'Произошла ошибка';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api; 