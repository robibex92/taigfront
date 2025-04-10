import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';

export const useCars = (userId) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await userApi.getUserCars(userId);
        setCars(data);
      } catch (error) {
        setError(error.message || 'Ошибка при загрузке автомобилей');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCars();
    }
  }, [userId]);

  const addCar = async (carData) => {
    try {
      const response = await userApi.updateUser(userId, {
        cars: [...cars, carData]
      });
      setCars(response.cars);
      return response.cars;
    } catch (error) {
      console.error('Ошибка при добавлении автомобиля:', error);
      throw error;
    }
  };

  const updateCar = async (carId, updatedData) => {
    try {
      const updatedCars = cars.map(car => 
        car.id === carId ? { ...car, ...updatedData } : car
      );
      
      const response = await userApi.updateUser(userId, {
        cars: updatedCars
      });
      
      setCars(response.cars);
      return response.cars;
    } catch (error) {
      console.error('Ошибка при обновлении автомобиля:', error);
      throw error;
    }
  };

  const deleteCar = async (carId) => {
    try {
      const updatedCars = cars.filter(car => car.id !== carId);
      
      const response = await userApi.updateUser(userId, {
        cars: updatedCars
      });
      
      setCars(response.cars);
      return response.cars;
    } catch (error) {
      console.error('Ошибка при удалении автомобиля:', error);
      throw error;
    }
  };

  return {
    cars,
    loading,
    error,
    addCar,
    updateCar,
    deleteCar
  };
};

export default useCars;
