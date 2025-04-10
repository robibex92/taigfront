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

const imageApi = {
  /**
   * Загружает одно изображение на сервер
   * @param {File} file - Файл изображения
   * @returns {Promise<{url: string}>} URL загруженного изображения
   */
  upload: async (file) => {
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
      throw new Error(error.response?.data?.message || 'Ошибка при загрузке изображения');
    }
  },

  /**
   * Загружает несколько изображений на сервер
   * @param {FormData} formData - FormData с изображениями (ключ 'images')
   * @returns {Promise<Array<{url: string}>>} Массив URL загруженных изображений
   */
  uploadMultiple: async (formData) => {
    try {
      formData.append('salt', SERVER_SALT);

      const response = await api.post('/images/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при загрузке изображений');
    }
  },

  /**
   * Удаляет изображение с сервера
   * @param {string} imageUrl - URL изображения для удаления
   * @returns {Promise<void>}
   */
  delete: async (imageUrl) => {
    try {
      await api.post('/images/delete', {
        imageUrl,
        salt: SERVER_SALT
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(error.response?.data?.message || 'Ошибка при удалении изображения');
    }
  }
};

export { imageApi }; 