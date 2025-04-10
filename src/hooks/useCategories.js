import { useState, useEffect } from 'react';
import { categoryApi } from '../services/apiService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для очистки ошибок
  const clearError = () => setError(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryApi.getAll();

        // Сохраняем все категории без предварительной фильтрации
        setCategories(data);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    clearError, // Добавляем возможность очистки ошибок
  };
};

export default useCategories;