import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

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
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Отправляем сессионные cookies
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
        } else {
          setUser(null);
          Cookies.remove('userData');
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
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegramUser), // Отправляем данные пользователя
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        Cookies.set("userData", JSON.stringify(userData), { expires: 7 });
        return userData;
      } else {
        throw new Error('Ошибка при аутентификации через Telegram');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Отправляем сессионные cookies
      });

      if (response.ok) {
        setUser(null);
        Cookies.remove('userData');
      } else {
        throw new Error('Ошибка при выходе');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 