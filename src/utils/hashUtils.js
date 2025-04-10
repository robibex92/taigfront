export const generateUserHash = (username) => {
  if (!username) return '';
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).substring(0, 16);
};

export const compareUserHash = (username, hash) => {
  return generateUserHash(username) === hash;
};
