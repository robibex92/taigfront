import { useState, useEffect } from 'react';
import { carService } from '../../../services/carService';

export const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const fetchedCars = await carService.getCars();
        setCars(fetchedCars);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { cars, loading, error, setCars };
}
