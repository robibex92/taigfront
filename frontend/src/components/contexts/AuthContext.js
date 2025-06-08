import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { API_URL } from "../config/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, newAccessToken, newRefreshToken) => {
    if (!newAccessToken || !newRefreshToken) {
      console.error("Login failed: missing tokens");
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return;
    }
    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error calling logout backend endpoint:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  useEffect(() => {
    const loadUserFromSession = async () => {
      setLoading(true);

      let storedAccessToken = localStorage.getItem("accessToken");
      let storedRefreshToken = localStorage.getItem("refreshToken");

      try {
        let currentUserData = null;
        let currentAccessToken = storedAccessToken;
        let currentRefreshToken = storedRefreshToken;

        if (currentAccessToken) {
          try {
            const sessionResponse = await fetch(`${API_URL}/auth/session`, {
              method: "GET",
              headers: { Authorization: `Bearer ${currentAccessToken}` },
            });

            if (sessionResponse.ok) {
              currentUserData = await sessionResponse.json();

              setUser(currentUserData);
              setAccessToken(currentAccessToken);
            } else {
              console.warn(
                "accessToken invalid or session expired (status:",
                sessionResponse.status,
                "). Attempting refresh..."
              );
              currentAccessToken = null;
            }
          } catch (sessionError) {
            console.error(
              "Error fetching session with accessToken:",
              sessionError
            );
            currentAccessToken = null;
          }
        }

        if (!currentUserData && currentRefreshToken) {
          try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentRefreshToken}`, // Send refresh token in Authorization header
              },
            });

            if (response.ok) {
              const data = await response.json();

              if (!data.accessToken || !data.refreshToken) {
                console.error("Refresh response missing tokens:", data);
                throw new Error("Invalid refresh response");
              }

              // Update localStorage first
              localStorage.setItem("accessToken", data.accessToken);
              localStorage.setItem("refreshToken", data.refreshToken);

              // Update state
              setUser(data.user);
              setAccessToken(data.accessToken);
              setRefreshToken(data.refreshToken);

              // Use the new access token directly from data for the session request
              const sessionResponse = await fetch(`${API_URL}/auth/session`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${data.accessToken}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });

              const sessionText = await sessionResponse.text();

              if (sessionResponse.ok) {
                const sessionData = JSON.parse(sessionText);
                setUser(sessionData);
                localStorage.setItem("user", JSON.stringify(sessionData));
              } else {
                console.error(
                  "Failed to fetch session after refresh:",
                  sessionText
                );
                throw new Error(
                  `Failed to fetch session after refresh: ${sessionText}`
                );
              }
            } else {
              const errorText = await response.text();
              console.error("Failed to refresh token:", errorText);
              throw new Error(`Failed to refresh token: ${errorText}`);
            }
          } catch (refreshError) {
            console.error("Error during refresh:", refreshError);
            throw refreshError;
          }
        }

        if (!currentUserData) {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (error) {
        console.error("Error during session restoration:", error);
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

    loadUserFromSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, accessToken, refreshToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
