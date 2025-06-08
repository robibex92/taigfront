import { API_URL } from '../config/config';

export const categoryApi = {
  getAll: async () => {
    // Кэширование категорий
    const { getCategoriesFromCache, setCategoriesToCache } = await import('../utils/categoriesCache');
    const cached = getCategoriesFromCache();
    if (cached) return cached;
    const res = await fetch(`${API_URL}/categories`);
    const json = await res.json();
    setCategoriesToCache(json.data);
    return json.data;
  },

  getSubcategories: async (categoryId) => {
    const res = await fetch(`${API_URL}/categories/${categoryId}/subcategories`);
    const json = await res.json();
    return json;
  }
};
