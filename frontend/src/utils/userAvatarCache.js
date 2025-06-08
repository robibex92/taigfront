// userAvatarCache.js
const userCache = new Map();

export function getUserFromCache(user_id) {
  return userCache.get(user_id);
}

export function setUserToCache(user_id, data) {
  userCache.set(user_id, data);
}
