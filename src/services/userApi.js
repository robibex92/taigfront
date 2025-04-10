import api from '../api/api';

export const userApi = {
  getUserApartments: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/apartments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user apartments:', error);
      throw error;
    }
  },

  getUserCars: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/cars`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user cars:', error);
      throw error;
    }
  },

  updateUser: async (userId, data) => {
    try {
      const response = await api.put(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

export default userApi; 