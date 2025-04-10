import { userApi } from './apiService';

export const validateCarNumber = (number) => {
  const carNumberRegex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;
  return carNumberRegex.test(number.toUpperCase());
};

export const formatCarNumber = (number) => {
  if (!number) return '';
  const cleanNumber = number.replace(/[^а-яА-ЯA-Za-z0-9]/g, '');
  return cleanNumber.length >= 6 
    ? `${cleanNumber.slice(0, 1)} ${cleanNumber.slice(1, 4)} ${cleanNumber.slice(4, 6)} ${cleanNumber.slice(6, 8)}`.toUpperCase()
    : cleanNumber.toUpperCase();
};

export const addCar = async (userId, carData) => {
  try {
    const userData = await userApi.getUser(userId);
    const cars = userData.cars || [];
    
    const newCar = {
      ...carData,
      id: Date.now(), // Генерируем временный ID
      created_at: new Date().toISOString()
    };

    const updatedUser = await userApi.updateUser(userId, {
      cars: [...cars, newCar]
    });

    return { success: true, car: newCar };
  } catch (error) {
    console.error('Ошибка при добавлении автомобиля:', error);
    return { success: false, error: error.message };
  }
};

export const updateCar = async (userId, carId, carData) => {
  try {
    const userData = await userApi.getUser(userId);
    const cars = userData.cars || [];
    
    const updatedCars = cars.map(car => 
      car.id === carId ? { ...car, ...carData } : car
    );

    await userApi.updateUser(userId, {
      cars: updatedCars
    });

    return { success: true };
  } catch (error) {
    console.error('Ошибка при обновлении автомобиля:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCar = async (userId, carId) => {
  try {
    const userData = await userApi.getUser(userId);
    const cars = userData.cars || [];
    
    const updatedCars = cars.filter(car => car.id !== carId);

    await userApi.updateUser(userId, {
      cars: updatedCars
    });

    return { success: true };
  } catch (error) {
    console.error('Ошибка при удалении автомобиля:', error);
    return { success: false, error: error.message };
  }
};

export const getUserCars = async (userId) => {
  try {
    const userData = await userApi.getUser(userId);
    return { success: true, cars: userData.cars || [] };
  } catch (error) {
    console.error('Ошибка при получении автомобилей:', error);
    return { success: false, error: error.message };
  }
};

export const getCarById = async (userId, carId) => {
  try {
    const userData = await userApi.getUser(userId);
    const car = userData.cars?.find(car => car.id === carId);
    
    if (!car) {
      throw new Error('Автомобиль не найден');
    }

    return { success: true, car };
  } catch (error) {
    console.error('Ошибка при получении автомобиля:', error);
    return { success: false, error: error.message };
  }
};

// Для обратной совместимости
export const carService = {
  async getCars() {
    const result = await getUserCars();
    return result.cars;
  },

  async addCar(carData) {
    const result = await addCar(carData);
    return result.success ? carData : null;
  },

  async deleteCar(carId) {
    const result = await deleteCar(carId);
    return result;
  }
};
