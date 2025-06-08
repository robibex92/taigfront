// nearbyApi.js
import api from '../utils/api';
import {
  getHousesFromCache, setHousesToCache,
  getEntrancesFromCache, setEntrancesToCache,
  getFloorRulesFromCache, setFloorRulesToCache
} from '../utils/nearbyCache';

export const nearbyApi = {
  getHouses: async () => {
    const cached = getHousesFromCache();
    if (cached) return cached;
    const res = await api.get('/nearby/houses');
    setHousesToCache(res);
    return res;
  },
  getEntrances: async (houseId) => {
    const cached = getEntrancesFromCache(houseId);
    if (cached) return cached;
    const res = await api.get(`/nearby/entrances/${houseId}`);
    setEntrancesToCache(houseId, res);
    return res;
  },
  getFloorRules: async (params) => {
    // params: { house, entrance, ... }
    const paramsKey = Object.entries(params).sort().map(([k,v]) => `${k}=${v}`).join('&');
    const cached = getFloorRulesFromCache(paramsKey);
    if (cached) return cached;
    const res = await api.get('/floorRules', { params });
    setFloorRulesToCache(paramsKey, res);
    return res;
  }
};
