import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { useCars } from '../hooks/useCars';
import CarInfoCard from '../components/CarInfoCard';
import SearchForm from '../components/SearchForm';
import ParkingRow from '../components/ParkingRow';

const WhoseCar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const carsPerRow = isMobile ? 4 : 10;

  const { cars, loading, error } = useCars();
  const [carNumber, setCarNumber] = useState('');
  const [carNumberError, setCarNumberError] = useState(false);
  const [foundCars, setFoundCars] = useState([]);
  const [highlightedSpots, setHighlightedSpots] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showInfo, setShowInfo] = useState(true);

  const getCarRows = () => {
    if (!cars) return [];
    const rows = [];
    for (let i = 0; i < cars.length; i += carsPerRow) {
      const row = cars.slice(i, i + carsPerRow);
      rows.push(row);
    }
    return rows;
  };

  const handleCarNumberChange = (value, isValid) => {
    const upperValue = value.toUpperCase().replace(/\s/g, '');
    setCarNumber(upperValue);
    setCarNumberError(!isValid);
    if (!upperValue) {
      setFoundCars([]);
      setHighlightedSpots([]);
      setShowInfo(true);
      setSelectedCar(null);
    }
  };

  const handleSearchCar = () => {
    const searchNumber = carNumber.toUpperCase().replace(/\s/g, '');
    const matchedCars = cars.filter(car => {
      const carNumberNorm = (car.car_number || '').toUpperCase().replace(/\s/g, '');
      return carNumberNorm === searchNumber;
    });
    setFoundCars(matchedCars);
    setShowInfo(false);
    if (matchedCars.length > 0) {
      const spots = matchedCars.map(car => cars.findIndex(c => c.id === car.id) + 1);
      setHighlightedSpots(spots);
      setSelectedCar(matchedCars[0]);
    } else {
      setHighlightedSpots([]);
      setSelectedCar(null);
    }
  };

  const handleCarClick = (car) => {
    if (selectedCar && selectedCar.id === car.id) {
      setSelectedCar(null);
      setFoundCars([]);
      setShowInfo(true);
      return;
    }
    setSelectedCar(car);
    setFoundCars([car]);
    setShowInfo(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Загрузка...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Ошибка: {error}</Typography>;
  }

  const carRows = getCarRows();

  return (
    <Box>
      <SearchForm 
        carNumber={carNumber}
        onCarNumberChange={handleCarNumberChange}
        onSearch={handleSearchCar}
        error={carNumberError}
      />

      <Box sx={{ 
        minHeight: 200, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        my: 2
      }}>
        {selectedCar ? (
          <CarInfoCard cars={[selectedCar]} />
        ) : showInfo ? (
          <Box sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Здесь вы можете попробовать найти хозяина автомобиля, и написать ему в телеграмм
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Свою машину можно добавить только через свой профиль
            </Typography>
          </Box>
        ) : (foundCars.length === 0 && carNumber) ? (
          <Typography variant="body1" color="error" align="center">
            Машина не найдена в базе
          </Typography>
        ) : null}
      </Box>

      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 2 }}>
        Парковочная схема
      </Typography>

      <Paper 
        elevation={2}
        sx={{ 
          p: 2, 
          backgroundColor: theme.palette.background.paper,
          overflowX: 'auto'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          minWidth: isMobile ? 400 : 'auto'
        }}>
          {carRows.map((row, rowIndex) => (
            <ParkingRow
              key={rowIndex}
              cars={row}
              rowIndex={rowIndex}
              onCarClick={handleCarClick}
              highlightedSpots={highlightedSpots}
              carAngle={rowIndex % 2 === 0 ? 30 : -150}
              carsPerRow={carsPerRow}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default WhoseCar;
