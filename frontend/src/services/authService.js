const API_URL = process.env.REACT_APP_API_URL || 'http://185.219.81.226:4000/api';

const authService = {
  // Авторизация через Telegram
  async handleTelegramAuth(telegramUser) {
    try {
      // Step 1: Perform authentication via Telegram API (4000 port)
      const response = await fetch(`${API_URL}/auth/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ВАЖНО! Разрешает серверу устанавливать cookie
        body: JSON.stringify({
          telegram_id: telegramUser.user_id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          avatar: telegramUser.photo_url,
        }),
      });

      if (!response.ok) {
        throw new Error('Telegram authentication failed');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);  // Сохраняем токен в localStorage
      }

      // Step 2: If needed, send the user data to SQL API (6543 port) for database storage
      const sqlResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: telegramUser.user_id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username,
          avatar: telegramUser.photo_url,
        }),
      });

      if (!sqlResponse.ok) {
        throw new Error('Failed to save user data to the database');
      }

      return data.user;
    } catch (error) {
      console.error('Error during Telegram authentication:', error);
      throw error;
    }
  },

  // Проверка текущей сессии
  async checkSession() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check session');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('token');
      return null;
    }
  },

  // Выход из системы
  logout() {
    localStorage.removeItem('token');
  },

  // Обновление данных пользователя
  async updateUserProfile(userId, firstName, lastName) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          telegram_first_name: firstName,
          telegram_last_name: lastName,
          is_manually_updated: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      const data = await response.json();

      // Step 3: Update user information in SQL API as well (assuming it's relevant)
      const sqlResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!sqlResponse.ok) {
        throw new Error('Failed to update user data in the database');
      }

      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

export default authService;
