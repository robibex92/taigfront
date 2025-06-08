import React, { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from "../config/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });
  const [loading, setLoading] = useState(true);

  // Автоматическое восстановление сессии при загрузке страницы
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        // Если нет токенов, просто очищаем состояние
        if (!accessToken || !refreshToken) {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setLoading(false); // Set loading to false even if no tokens
          return;
        }

        // Попытка обновить Access Token с использованием Refresh Token
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const refreshData = await refreshRes.json();

        if (refreshRes.ok && refreshData.accessToken) {
          // Access Token успешно обновлен, теперь получим актуальные данные пользователя
          const sessionRes = await fetch(`${API_URL}/auth/session`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
          });

          const sessionData = await sessionRes.json();

          if (sessionRes.ok && sessionData) {
            // Сессия успешно восстановлена, сохраняем новые токены и данные пользователя
            // sessionData уже содержит данные пользователя напрямую
            login(
              sessionData,
              refreshData.accessToken,
              refreshData.refreshToken
            );
          } else {
            // Fallback: If session fetch fails but refresh succeeded, maybe the old user object is still valid?
            // Or should we force re-login? Let's clear for safety.

            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } else {
          // Если Refresh Token невалидный или истек, очищаем состояние

          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (e) {
        // console.error("AuthContext: Session restore error:", e); // Log any catch error
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []); // Убираем зависимости, чтобы запускалось только при монтировании

  // Логин пользователя
  const login = (userData, token, refresh) => {
    if (!token || !refresh) {
      // console.error("AuthContext: Login failed: missing tokens");
      return;
    }

    if (!userData) {
      // Если userData равно null, очищаем информацию о пользователе
      setUser(null);
      localStorage.removeItem("user");
    } else {
      // Явный выбор полей пользователя для сохранения во фронтенд состоянии
      // Убедитесь, что эти поля соответствуют безопасным данным, возвращаемым бэкендом (/auth/session)
      const userToSave = {
        user_id: userData.user_id,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar: userData.avatar,
        status: userData.status, // Ensure status is saved if needed
        telegram_first_name: userData.telegram_first_name,
        telegram_last_name: userData.telegram_last_name,
        is_manually_updated: userData.is_manually_updated,
      };

      setUser(userToSave);
      localStorage.setItem("user", JSON.stringify(userToSave));
    }

    setAccessToken(token);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refresh);
  };

  // Логаут пользователя
  const logout = async () => {
    const token = localStorage.getItem("accessToken"); // Get current access token for logout request
    try {
      if (token) {
        // Only send logout request if access token exists
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
        } else {
          const errorData = await response.json();
          // console.error(
          //   "AuthContext: Backend logout failed:",
          //   errorData.error || "Unknown error"
          // );
        }
      } else {
      }
    } catch (error) {
      // console.error("AuthContext: Error during logout request:", error); // Log catch error
      // Continue clearing frontend even if backend request fails
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // No navigation/UI updates here - let consuming components react to context change
    }
  };

  // isAuthenticated can be derived from user presence
  const isAuthenticated = !!user && !!accessToken;

  // --- Добавляем функцию обновления пользователя ---
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        loading,
        isAuthenticated,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
