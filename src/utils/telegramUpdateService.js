import axios from 'axios';

const TELEGRAM_API_URL = process.env.REACT_APP_API_URL;
const SERVER_SALT = process.env.REACT_APP_SERVER_SALT;

const api = axios.create({
  baseURL: TELEGRAM_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateAnnouncementInTelegram = async (announcement) => {
  try {
    const response = await api.post('/telegram/announcement/update', {
      ...announcement,
      salt: SERVER_SALT
    });
    return response.data;
  } catch (error) {
    console.error('Error updating announcement in Telegram:', error);
    throw error;
  }
};

export const sendUpdateToTelegram = async (update) => {
  try {
    const response = await api.post('/telegram/update', {
      ...update,
      salt: SERVER_SALT
    });
    return response.data;
  } catch (error) {
    console.error('Error sending update to Telegram:', error);
    throw error;
  }
};

export default {
  updateAnnouncementInTelegram,
  sendUpdateToTelegram
};
