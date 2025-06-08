const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export const updateUserProfile = async (userData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Нет accessToken для авторизации!");
    const response = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при обновлении профиля");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Ошибка при обновлении профиля");
  }
};
