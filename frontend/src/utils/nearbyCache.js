// nearbyCache.js
const housesCache = null;
const entrancesCache = new Map();
const floorRulesCache = new Map();

export function getHousesFromCache() {
  return housesCache;
}
export function setHousesToCache(data) {
  globalThis._housesCache = data;
}

export function getEntrancesFromCache(houseId) {
  return entrancesCache.get(houseId);
}
export function setEntrancesToCache(houseId, data) {
  entrancesCache.set(houseId, data);
}

export function getFloorRulesFromCache(paramsKey) {
  return floorRulesCache.get(paramsKey);
}
export function setFloorRulesToCache(paramsKey, data) {
  floorRulesCache.set(paramsKey, data);
}
