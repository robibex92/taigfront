// categoriesCache.js
let categoriesCache = null;

export function getCategoriesFromCache() {
  return categoriesCache;
}

export function setCategoriesToCache(categories) {
  categoriesCache = categories;
}
