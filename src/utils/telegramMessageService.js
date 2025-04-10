import axios from 'axios';

const TELEGRAM_API_URL = process.env.REACT_APP_API_URL;
const SERVER_SALT = process.env.REACT_APP_SERVER_SALT;

/**
 * Отправляет сообщение в Telegram
 * @param {string} announcementId - ID объявления
 * @param {string} message - Текст сообщения
 * @returns {Promise<Object>} Результат отправки сообщения
 */
export const sendTelegramMessage = async (announcementId, message) => {
  try {
    if (!announcementId || !message) {
      throw new Error('Не указаны обязательные параметры');
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/telegram/sendMessage`, {
      announcement_id: announcementId,
      message: message,
      salt: SERVER_SALT
    });

    return response.data;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw new Error(error.response?.data?.message || 'Ошибка при отправке сообщения в Telegram');
  }
};

/**
 * Форматирует сообщение для Telegram
 * @param {string} text - Текст сообщения
 * @returns {string} Отформатированный текст
 */
export const formatTelegramMessage = (text) => {
  // Экранируем специальные HTML-символы
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
