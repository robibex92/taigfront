// fetchWithTimeout: добавляет таймаут к стандартному fetch
export const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    return fetch(url, {
      ...options,
      signal: controller.signal,
    }).finally(() => clearTimeout(id));
  };
  