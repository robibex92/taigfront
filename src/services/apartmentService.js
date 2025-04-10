import { userApi } from './apiService';

export const addApartment = async (userId, apartmentData) => {
  try {
    const userData = await userApi.getUser(userId);
    const apartments = userData.apartments || [];
    
    const newApartment = {
      ...apartmentData,
      id: Date.now(), // Генерируем временный ID
      created_at: new Date().toISOString()
    };

    const updatedUser = await userApi.updateUser(userId, {
      apartments: [...apartments, newApartment]
    });

    return { success: true, apartment: newApartment };
  } catch (error) {
    console.error('Ошибка при добавлении квартиры:', error);
    return { success: false, error: error.message };
  }
};

export const updateApartment = async (userId, apartmentId, apartmentData) => {
  try {
    const userData = await userApi.getUser(userId);
    const apartments = userData.apartments || [];
    
    const updatedApartments = apartments.map(apt => 
      apt.id === apartmentId ? { ...apt, ...apartmentData } : apt
    );

    await userApi.updateUser(userId, {
      apartments: updatedApartments
    });

    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении квартиры:', error);
    return { success: false, error: error.message };
  }
};

export const deleteApartment = async (userId, apartmentId) => {
  try {
    const userData = await userApi.getUser(userId);
    const apartments = userData.apartments || [];
    
    const updatedApartments = apartments.filter(apt => apt.id !== apartmentId);

    await userApi.updateUser(userId, {
      apartments: updatedApartments
    });

    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении квартиры:', error);
    return { success: false, error: error.message };
  }
};

export const getUserApartments = async (userId) => {
  try {
    const userData = await userApi.getUser(userId);
    return { success: true, apartments: userData.apartments || [] };
  } catch (error) {
    console.error('Ошибка при получении квартир:', error);
    return { success: false, error: error.message };
  }
};

export const getApartmentById = async (userId, apartmentId) => {
  try {
    const userData = await userApi.getUser(userId);
    const apartment = userData.apartments?.find(apt => apt.id === apartmentId);
    
    if (!apartment) {
      throw new Error('Квартира не найдена');
    }

    return { success: true, apartment };
  } catch (error) {
    console.error('Ошибка при получении квартиры:', error);
    return { success: false, error: error.message };
  }
};
