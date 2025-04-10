import { userApi } from './apiService';

export const fetchUserProfile = async (userId) => {
  try {
    const userData = await userApi.getUser(userId);
    return {
      user: userData,
      apartments: userData.apartments || [],
      cars: userData.cars || []
    };
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    throw error;
  }
};

export const updateUserName = async (userId, firstName, lastName) => {
  try {
    const updatedUser = await userApi.updateUser(userId, {
      telegram_first_name: firstName,
      telegram_last_name: lastName,
      is_manually_updated: true
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Ошибка обновления имени:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const updatedUser = await userApi.updateUser(userId, {
      avatar: avatarUrl
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Ошибка обновления аватара:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserSettings = async (userId, settings) => {
  try {
    const updatedUser = await userApi.updateUser(userId, {
      settings: settings
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserNotifications = async (userId, notifications) => {
  try {
    const updatedUser = await userApi.updateUser(userId, {
      notifications: notifications
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Ошибка обновления настроек уведомлений:', error);
    return { success: false, error: error.message };
  }
};

export const addApartment = async (userId, apartmentData) => {
  try {
    const { error } = await supabase
      .from('apartments')
      .insert({ ...apartmentData, user_id: userId });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Ошибка добавления квартиры:', error);
    return { success: false, error: error.message };
  }
};

export const deleteApartment = async (apartmentId) => {
  try {
    const { error } = await supabase
      .from('apartments')
      .delete()
      .eq('id', apartmentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления квартиры:', error);
    return { success: false, error: error.message };
  }
};

export const addCar = async (userId, carData) => {
  try {
    const { error } = await supabase
      .from('cars')
      .insert({ ...carData, user_id: userId });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Ошибка добавления автомобиля:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCar = async (carId) => {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления автомобиля:', error);
    return { success: false, error: error.message };
  }
};
