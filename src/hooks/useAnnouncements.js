import { useState, useEffect } from 'react';
import { announcementApi } from '../services/apiService';

export const useAnnouncements = (filters = {}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Функция для очистки ошибок
  const clearError = () => setError(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const { data, total } = await announcementApi.getList(filters);
        setAnnouncements(data);
        setTotalCount(total);
      } catch (err) {
        console.error('Ошибка при загрузке объявлений:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Используем JSON.stringify(filters), чтобы избежать лишних запросов
    fetchAnnouncements();
  }, [JSON.stringify(filters)]);

  // Создание объявления
  const createAnnouncement = async (data) => {
    try {
      const newAnnouncement = await announcementApi.create(data);
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      return newAnnouncement;
    } catch (err) {
      console.error('Ошибка при создании объявления:', err);
      setError(err);
      throw err;
    }
  };

  // Обновление объявления
  const updateAnnouncement = async (id, data) => {
    try {
      const updatedAnnouncement = await announcementApi.update(id, data);
      setAnnouncements((prev) =>
        prev.map((ann) => (ann.id === id ? updatedAnnouncement : ann))
      );
      return updatedAnnouncement;
    } catch (err) {
      console.error('Ошибка при обновлении объявления:', err);
      setError(err);
      throw err;
    }
  };

  // Удаление объявления
  const deleteAnnouncement = async (id) => {
    try {
      await announcementApi.delete(id);
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении объявления:', err);
      setError(err);
      throw err;
    }
  };

  // Сортировка объявлений на клиентской стороне
  const sortAnnouncements = (mode) => {
    if (!['popular', 'newest'].includes(mode)) return;

    const sorted = [...announcements].sort((a, b) => {
      if (mode === 'popular') {
        return b.likes - a.likes; // Предположим, что популярность определяется по количеству лайков
      }
      if (mode === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at); // Сортировка по дате создания
      }
    });

    setAnnouncements(sorted);
  };

  return {
    announcements,
    loading,
    error,
    totalCount,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    sortAnnouncements, // Добавляем функцию сортировки
    clearError, // Добавляем возможность очистки ошибок
  };
};

export default useAnnouncements;