import { API_URL } from '../config/config';

export const categoryApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/categories`);
    const json = await res.json();
    return json.data;
  },

  getSubcategories: async (categoryId) => {
    const res = await fetch(`${API_URL}/categories/${categoryId}/subcategories`);
    const json = await res.json();
    return json;
  }
};
