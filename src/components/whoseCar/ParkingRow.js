import React from 'react';
import { Box } from '@mui/material';
import CarSVG from './CarSVG';
import { getColorFromDescription } from '../../utils/colorUtils';

const ParkingRow = ({ 
  cars, 
  rowIndex,
  onCarClick, 
  highlightedSpots,
  carAngle = 30,
  carsPerRow
}) => {
  // Создаем массив с пустыми местами, если нужно
  const filledRow = Array(carsPerRow).fill(null).map((_, i) => cars[i] || null);

  // Общий стиль для номера места
  const spotNumberStyle = {
    position: 'absolute',
    bottom: 5,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.75rem',
    color: 'text.secondary',
    backgroundColor: 'background.paper',
    padding: '2px 4px',
    borderRadius: '4px',
    minWidth: '20px',
    textAlign: 'center',
    lineHeight: 1,
    zIndex: 1
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        py: 2,
        pb: 3,
        px: 1,
        backgroundColor: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(255,255,255,0.05)' 
          : 'rgba(0,0,0,0.02)',
        borderRadius: 1,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          backgroundColor: 'divider'
        }
      }}
    >
      {filledRow.map((car, index) => {
        const spotNumber = rowIndex * carsPerRow + index + 1;
        const isHighlighted = car && highlightedSpots.includes(spotNumber);
        
        // Общий контейнер для места парковки
        const spotContainer = {
          width: 60,
          height: 115, // 90px для машины + 25px отступ
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        };
        
        // Если нет машины, возвращаем пустое место
        if (!car) {
          return (
            <Box
              key={index}
              sx={spotContainer}
            >
              <Box sx={{ flex: 1 }} /> {/* Пустое пространство */}
              <Box sx={spotNumberStyle}>
                {spotNumber}
              </Box>
            </Box>
          );
        }

        return (
          <Box
            key={index}
            onClick={() => onCarClick(car)}
            sx={{
              ...spotContainer,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              transform: isHighlighted ? 'scale(1.1)' : 'none',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              opacity: car.status === false ? 0.5 : 1
            }}>
              <CarSVG
                width={60}
                height={90}
                fill={getColorFromDescription(car.car_color)}
                stroke="currentColor"
                angle={carAngle}
              />
            </Box>
            <Box sx={spotNumberStyle}>
              {spotNumber}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ParkingRow;
