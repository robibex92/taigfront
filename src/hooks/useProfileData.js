import { useState, useEffect } from 'react';
import { userApi } from '../services/apiService';

export const useProfileData = (user) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userId = user.id || user.user_id;
        const userData = await userApi.getUser(userId);
        
        setCurrentUser(userData);
        setUserData(userData);
      } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const updateUserName = async (firstName, lastName) => {
    try {
      if (!firstName.trim() || !lastName.trim()) {
        throw new Error('Имя и фамилия не могут быть пустыми');
      }

      const updatedUser = await userApi.updateUser(currentUser.user_id || currentUser.id, {
        telegram_first_name: firstName,
        telegram_last_name: lastName,
        is_manually_updated: true
      });

      setCurrentUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Ошибка при обновлении имени:', error);
      throw error;
    }
  };

  return {
    currentUser,
    userData,
    isLoading,
    error,
    updateUserName
  };
};

export default useProfileData;
