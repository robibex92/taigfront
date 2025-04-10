import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Создаем инстанс axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена к запросам
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

// API для работы с пользователями
export const userApi = {
  // Получение данных пользователя
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Обновление данных пользователя
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Получение списка пользователей
  async getUsers(params) {
    const response = await api.get('/users', { params });
    return response.data;
  }
};

// API для работы с объявлениями
export const announcementApi = {
  // Создание объявления
  async create(data) {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  // Получение объявления по ID
  async getById(id) {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  // Получение списка объявлений
  async getList(params) {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  // Обновление объявления
  async update(id, data) {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },

  // Удаление объявления
  async delete(id) {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  }
};

// API для работы с категориями
export const categoryApi = {
  // Получение всех категорий
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  // Получение подкатегорий для категории
  async getSubcategories(categoryId) {
    const response = await api.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  }
};

// API для работы с изображениями
export const imageApi = {
  // Загрузка изображения
  async upload(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Загрузка нескольких изображений
  async uploadMultiple(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await api.post('/images/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api; 