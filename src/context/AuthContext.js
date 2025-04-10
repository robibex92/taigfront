import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromSession = async () => {
      setLoading(true);
      try {
        // Сначала пытаемся загрузить пользователя из cookies
        const storedUserData = Cookies.get('userData');
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);
        }

        // Затем пытаемся загрузить данные из сессии
        const userData = await authService.checkSession();
        if (userData) {
          setUser(userData);
          Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
        } else {
          setUser(null);
          Cookies.remove("userData");
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        setUser(null);
        Cookies.remove('userData');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromSession();
  }, []);

  const login = async (telegramUser) => {
    try {
      // Вход через Telegram
      const userData = await authService.handleTelegramAuth(telegramUser);
      setUser(userData);
      Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
      return userData;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    // Выход из системы
    authService.logout();
    setUser(null);
    Cookies.remove('userData');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
