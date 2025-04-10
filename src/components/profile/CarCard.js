import React from 'react';
import { 
  Paper,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CarSVG from '../whoseCar/CarSVG';
import { getColorFromDescription } from '../../utils/colorUtils';
import RussianLicensePlate from '../common/RussianLicensePlate';

const CarCard = ({ car, onDelete, isHovered, onMouseEnter, onMouseLeave }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCopyNumber = (rawNumber) => {
    navigator.clipboard.writeText(rawNumber);
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2,
        mb: 2,
        position: 'relative',
        backgroundColor: isDarkMode ? 'background.paper' : '#fff',
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)'
        },
        opacity: car.status === false ? 0.5 : 1, 
        border: '2px dashed', 
        borderColor: 'text.secondary'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2, 
          flex: 1,
          flexWrap: 'wrap',
          '& .MuiTypography-root': {
            minWidth: isMobile ? '45%' : 'auto'
          }
        }}>
          <CarSVG color={getColorFromDescription(car.car_color)} width={24} height={24} />
          <Typography>
            <strong>Марка:</strong> {car.car_brand}
          </Typography>
          <Typography>
            <strong>Модель:</strong> {car.car_model}
          </Typography>
          <Typography>
            <strong>Цвет:</strong> {car.car_color}
          </Typography>
          <Box 
            onClick={() => handleCopyNumber(car.car_number)}
            sx={{ 
              cursor: 'pointer',
              width: isMobile ? '100%' : 'auto',
              mt: isMobile ? 1 : 0,
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            <RussianLicensePlate number={car.car_number} />
          </Box>
          {car.status === false && (
            <Typography 
              component="span" 
              sx={{ 
                color: 'warning.main',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              (На проверке)
            </Typography>
          )}
        </Box>

        <Box 
                        sx={{ 
                          width: 50,
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.grey[200],
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                          '&:hover': {
                            backgroundColor: theme.palette.error.light,
                          }
                        }}
                        onClick={() => onDelete(car)}
                      >
                        <IconButton>
                          <DeleteIcon sx={{ color: theme.palette.common.black }} />
                        </IconButton>
                      </Box>
      </Box>
    </Paper>
  );
};

export default CarCard;
