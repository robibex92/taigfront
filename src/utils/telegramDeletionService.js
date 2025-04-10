import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SERVER_SALT = process.env.REACT_APP_SERVER_SALT;

// Функция для удаления объявления из всех телеграм-чатов
export const deleteAnnouncementFromTelegram = async (announcement) => {
  try {
    const response = await axios.post(`${API_URL}/telegram/deleteAnnouncement`, {
      announcement,
      server_salt: SERVER_SALT
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении объявления:', error);
    return { success: false, message: error.message };
  }
};

// Функция для удаления конкретного сообщения или медиа-группы в Telegram
export const deleteMessage = async ({ chatId, messageId, mediaGroupId }) => {
  try {
    const response = await axios.post(`${API_URL}/telegram/deleteMessage`, {
      chat_id: chatId,
      message_id: messageId,
      media_group_id: mediaGroupId,
      server_salt: SERVER_SALT
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении сообщения:', error);
    return { success: false, message: error.message };
  }
};
