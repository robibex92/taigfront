import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import CarSVG from './CarSVG';
import { getColorFromDescription } from '../../utils/colorUtils';

const ParkingSpot = ({ 
  car, 
  rotation, 
  index, 
  startIndex,
  isHighlighted,
  onSelect 
}) => {
  const theme = useTheme();
  const spotNumber = startIndex + index;
  const carColor = car ? getColorFromDescription(car.car_color || 'gray') : '#808080';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: isHighlighted 
          ? theme.palette.primary.light 
          : theme.palette.grey[200],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotation}deg)`,
        cursor: car ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: car ? `rotate(${rotation}deg) scale(1.05)` : `rotate(${rotation}deg)`,
          zIndex: car ? 2 : 1
        }
      }}
      onClick={() => car && onSelect(car)}
    >
      {car && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transform: `rotate(${-rotation - 30}deg)`,
            '& > *': {
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto'
            }
          }}
        >
          <CarSVG fill={carColor} stroke={theme.palette.grey[900]} />
        </Box>
      )}
      <Typography
        sx={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          color: theme.palette.mode === 'dark' ? theme.palette.common.black : 'text.secondary',
          fontSize: '0.7rem',
          zIndex: 1,
          transform: `rotate(-${rotation}deg)`
        }}
      >
        {spotNumber}
      </Typography>
    </Box>
  );
};

export default ParkingSpot;
