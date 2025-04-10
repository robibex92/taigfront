import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddCarForm from '../common/AddCarForm';
import CarCard from './CarCard';
import { carService } from '../../services/carService';

const ProfileCars = ({ 
  cars = [], 
  setCars, 
  onAddCar, 
  onEditCar,
  onDeleteCar,
  currentUser
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState(() => {
    const savedState = localStorage.getItem('carsAccordionState');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showAddCarForm, setShowAddCarForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('carsAccordionState', JSON.stringify(expanded));
  }, [expanded]);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleCarAdded = (newCar) => {
    setCars(prevCars => {
      const carExists = prevCars.some(
        car => car.car_number === newCar.car_number
      );
      
      return carExists 
        ? prevCars 
        : [...prevCars, newCar];
    });
    setShowAddCarForm(false);
  };

  const handleCarDelete = async (car) => {
    try {
      const result = await carService.deleteCar(car.id);
      
      if (result.success) {
        setCars(prevCars => 
          prevCars.filter(c => c.id !== car.id)
        );
      }
    } catch (error) {
      console.error('Ошибка удаления машины:', error);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      
      <Accordion 
        expanded={expanded} 
        onChange={handleChange}
        sx={{ 
          '& .MuiAccordionSummary-root': { 
            paddingRight: 0 
          } 
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="cars-content"
          id="cars-header"
          sx={{ 
            '& .MuiAccordionSummary-content': { 
              display: 'flex', 
              alignItems: 'center',
              width: '100%'
            }
          }}
        >
          <Typography variant="h6">Список ваших автомобилей</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {cars.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              У вас пока нет добавленных автомобилей
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {cars.map((car) => (
                <Grid item xs={12} key={car.id}>
                  <CarCard
                    car={car}
                    onDelete={handleCarDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {!showAddCarForm ? (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddCarForm(true)}
              sx={{ mt: 2 }}
              fullWidth
            >
              Добавить автомобиль
            </Button>
          ) : (
            <AddCarForm
              onCarAdded={handleCarAdded}
              onCancel={() => setShowAddCarForm(false)}
              currentUser={currentUser}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ProfileCars;
