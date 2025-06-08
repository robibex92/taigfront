import { useState, useEffect } from 'react';
import { API_URL } from "../config/config";

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_URL}/cars`);
        const data = await res.json();
        setCars(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || err);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return { cars, loading, error, setCars };
};
