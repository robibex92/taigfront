import { useState, useEffect } from 'react';
import { userApi } from '../services/userApi';

export const useApartments = (userId) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const data = await userApi.getUserApartments(userId);
        setApartments(data);
      } catch (error) {
        setError(error.message || 'Ошибка при загрузке квартир');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchApartments();
    }
  }, [userId]);

  const addApartment = async (apartmentData) => {
    try {
      const response = await userApi.updateUser(userId, {
        apartments: [...apartments, apartmentData]
      });
      setApartments(response.apartments);
      return response.apartments;
    } catch (error) {
      console.error('Ошибка при добавлении квартиры:', error);
      throw error;
    }
  };

  const updateApartment = async (apartmentId, updatedData) => {
    try {
      const updatedApartments = apartments.map(apt => 
        apt.id === apartmentId ? { ...apt, ...updatedData } : apt
      );
      
      const response = await userApi.updateUser(userId, {
        apartments: updatedApartments
      });
      
      setApartments(response.apartments);
      return response.apartments;
    } catch (error) {
      console.error('Ошибка при обновлении квартиры:', error);
      throw error;
    }
  };

  const deleteApartment = async (apartmentId) => {
    try {
      const updatedApartments = apartments.filter(apt => apt.id !== apartmentId);
      
      const response = await userApi.updateUser(userId, {
        apartments: updatedApartments
      });
      
      setApartments(response.apartments);
      return response.apartments;
    } catch (error) {
      console.error('Ошибка при удалении квартиры:', error);
      throw error;
    }
  };

  return {
    apartments,
    loading,
    error,
    addApartment,
    updateApartment,
    deleteApartment
  };
};

export default useApartments;
