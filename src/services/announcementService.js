import { announcementApi } from './apiService';

export const createAnnouncement = async (data) => {
  try {
    const newAnnouncement = await announcementApi.create(data);
    return { success: true, announcement: newAnnouncement };
  } catch (error) {
    console.error('Ошибка при создании объявления:', error);
    return { success: false, error: error.message };
  }
};

export const getAnnouncements = async (filters = {}) => {
  try {
    const { data, total } = await announcementApi.getList(filters);
    return { 
      success: true, 
      announcements: data,
      total
    };
  } catch (error) {
    console.error('Ошибка при получении объявлений:', error);
    return { success: false, error: error.message };
  }
};

export const getAnnouncementById = async (id) => {
  try {
    const announcement = await announcementApi.getById(id);
    return { success: true, announcement };
  } catch (error) {
    console.error('Ошибка при получении объявления:', error);
    return { success: false, error: error.message };
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const updatedAnnouncement = await announcementApi.update(id, data);
    return { success: true, announcement: updatedAnnouncement };
  } catch (error) {
    console.error('Ошибка при обновлении объявления:', error);
    return { success: false, error: error.message };
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    await announcementApi.delete(id);
    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении объявления:', error);
    return { success: false, error: error.message };
  }
};
