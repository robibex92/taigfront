import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { carService } from '../../services/carService';

const carColors = [
  { value: 'undefined', name: 'Не определен' },
  { value: 'white', name: 'Белый' },
  { value: 'black', name: 'Черный' },
  { value: 'gray', name: 'Серый' },
  { value: 'silver', name: 'Серебристый' },
  { value: 'blue', name: 'Синий' },
  { value: 'red', name: 'Красный' },
  { value: 'green', name: 'Зеленый' },
  { value: 'yellow', name: 'Желтый' },
  { value: 'brown', name: 'Коричневый' }
];

const AddCarModal = ({ open, onClose, onSubmit, cars }) => {
  const [carNumber, setCarNumber] = useState('');
  const [carColor, setCarColor] = useState('undefined');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carNumberError, setCarNumberError] = useState(false);

  // Функция валидации российского автомобильного номера
  const validateCarNumber = (number) => {
    const russianCarNumberRegex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;
    return russianCarNumberRegex.test(number.toUpperCase());
  };

  const handleSubmit = () => {
    if (validateCarNumber(carNumber)) {
      // Находим максимальный существующий id и увеличиваем на 1
      const maxId = cars.length > 0 
        ? Math.max(...cars.map(car => car.id)) 
        : 0;
      
      onSubmit({
        id: maxId + 1,
        user_id: 11111111,
        car_number: carNumber.toUpperCase(),
        car_color: carColor,
        car_brand: carBrand,
        car_model: carModel
      });
      onClose();
    } else {
      setCarNumberError(true);
    }
  };

  const handleCarNumberChange = (event) => {
    const value = event.target.value.toUpperCase();
    setCarNumber(value);
    setCarNumberError(!validateCarNumber(value) && value !== '');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      aria-labelledby="add-car-dialog-title"
    >
      <DialogTitle id="add-car-dialog-title">+ Рассказать об автомобиле</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Номер автомобиля"
            variant="outlined"
            value={carNumber}
            onChange={handleCarNumberChange}
            error={carNumberError}
            helperText={carNumberError ? "Неверный формат номера" : ""}
            placeholder="А123БВ50"
            fullWidth
            margin="normal"
            required
            aria-required="true"
          />
          <FormControl fullWidth>
            <InputLabel>Цвет</InputLabel>
            <Select
              value={carColor}
              label="Цвет"
              onChange={(e) => setCarColor(e.target.value)}
            >
              {carColors.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Марка"
            variant="outlined"
            value={carBrand}
            onChange={(e) => setCarBrand(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Модель"
            variant="outlined"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!carNumber || !carColor || !carBrand || !carModel}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCarModal;
