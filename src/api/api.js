import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const SERVER_SALT = process.env.REACT_APP_SERVER_SALT;

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

// API для работы с категориями
export const getCategories = async () => {
  try {
    const response = await api.get('/categories', {
      params: { salt: SERVER_SALT }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// API для работы с продуктами
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', {
      params: {
        ...params,
        salt: SERVER_SALT
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// API для работы с FAQ
export const getFAQ = async () => {
  try {
    const response = await api.get('/faq', {
      params: { salt: SERVER_SALT }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    throw error;
  }
};

// API для работы с домами
export const getHouses = async () => {
  try {
    const response = await api.get('/houses', {
      params: { salt: SERVER_SALT }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching houses:', error);
    throw error;
  }
};

// API для работы с подъездами
export const getEntrances = async (houseId) => {
  try {
    const response = await api.get(`/houses/${houseId}/entrances`, {
      params: { salt: SERVER_SALT }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching entrances:', error);
    throw error;
  }
};

// API для работы с правилами этажей
export const getFloorRules = async () => {
  try {
    const response = await api.get('/floor-rules', {
      params: { salt: SERVER_SALT }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching floor rules:', error);
    throw error;
  }
};

// API для работы с изображениями
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('salt', SERVER_SALT);

    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    await api.post('/images/delete', {
      imageUrl,
      salt: SERVER_SALT
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Алиасы для обратной совместимости
export const fetchFAQ = getFAQ;
export const fetchHouses = getHouses;
export const fetchFloorRules = getFloorRules;
export const fetchApartmentsByEntrance = async (entranceId) => {
  try {
    const response = await api.get(`/entrances/${entranceId}/apartments`, {
      params: { salt: SERVER_SALT }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching apartments:', error);
    throw error;
  }
};

export default api; 