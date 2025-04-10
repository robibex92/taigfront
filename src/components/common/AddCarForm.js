import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { carService } from '../../services/carService';

const CAR_COLORS = [
  { value: 'undefined', name: 'Не определен' },
  { value: 'white', name: 'Белый' },
  { value: 'black', name: 'Черный' },
  { value: 'gray', name: 'Серый' },
  { value: 'red', name: 'Красный' },
  { value: 'blue', name: 'Синий' },
  { value: 'green', name: 'Зеленый' },
  { value: 'yellow', name: 'Желтый' }
];

export default function AddCarForm({ 
  onCarAdded, 
  onCancel, 
  flexDirection = 'row', 
  initialData = {}, 
  source = 'profile' 
}) {
  const { user } = useAuth();
  const [carData, setCarData] = useState({
    car_brand: initialData.car_brand || '',
    car_model: initialData.car_model || '',
    car_number: initialData.car_number || '',
    car_color: initialData.car_color || 'undefined'
  });
  const [errors, setErrors] = useState({});

  const validateCarNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '').toUpperCase();
    const russianCarNumberRegex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/;
    return russianCarNumberRegex.test(cleanNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const processedValue = name === 'car_number' 
      ? value.replace(/[^А-Яа-яA-Za-z0-9]/g, '').toUpperCase() 
      : name === 'car_brand' || name === 'car_model'
        ? value.toUpperCase()
        : value;
    
    setCarData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    if (name === 'car_number') {
      const isValidNumber = validateCarNumber(processedValue);
      
      setErrors(prev => ({
        ...prev,
        car_number: processedValue && !isValidNumber 
          ? 'Введите корректный номер. Например: А123АА12' 
          : ''
      }));
    } else {
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!carData.car_brand) newErrors.car_brand = 'Введите марку';
    if (!carData.car_model) newErrors.car_model = 'Введите модель';
    if (!carData.car_number) newErrors.car_number = 'Введите номер';
    
    if (!validateCarNumber(carData.car_number)) {
      newErrors.car_number = 'Введите корректный номер. Например: А123АА12';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Безопасная проверка user
      if (source === 'profile' && !user) {
        throw new Error('Пользователь не авторизован');
      }
      
      const userId = source === 'profile' 
        ? user?.user_id || user?.id 
        : '11111111';
      
      // Обработка цвета: null вместо 'undefined'
      const carToAdd = {
        ...carData,
        user_id: userId,
        car_color: carData.car_color === 'undefined' ? null : carData.car_color
      };
      
      const result = await carService.addCar(carToAdd);
      
      // Всегда вызываем onCarAdded, даже если сервер вернул ошибку
      if (typeof onCarAdded === 'function') {
        onCarAdded(carToAdd);
      }
      
      // Безопасный вызов onCancel
      if (typeof onCancel === 'function') {
        onCancel();
      }
    } catch (error) {
      const errorMessage = error.message 
        ? error.message 
        : 'Произошла неизвестная ошибка при добавлении машины';
      
      console.error('Ошибка при добавлении машины:', errorMessage);
      
      // Показ ошибки пользователю
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    }
  };

  // Проверка заполненности всех полей
  const isFormValid = 
    carData.car_brand && 
    carData.car_model && 
    carData.car_number && 
    validateCarNumber(carData.car_number);

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr', 
          md: 'repeat(6, 1fr)', 
        },
        gap: 2,
        width: '100%',
        position: 'relative',
        mb: source === 'profile' ? 2 : 0 
      }}
    >
      {/* Глобальное сообщение об ошибке */}
      {errors.submit && (
        <Typography 
          color="error" 
          sx={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            mb: 2 
          }}
        >
          {errors.submit}
        </Typography>
      )}

      <TextField
        name="car_brand"
        label="Марка"
        value={carData.car_brand}
        onChange={handleChange}
        error={!!errors.car_brand}
        helperText={errors.car_brand}
        sx={{ 
          width: '100%'
        }}
        required
      />
      <TextField
        name="car_model"
        label="Модель"
        value={carData.car_model}
        onChange={handleChange}
        error={!!errors.car_model}
        helperText={errors.car_model}
        sx={{ 
          width: '100%'
        }}
        required
      />
      <TextField
        name="car_number"
        label="Номер"
        value={carData.car_number}
        onChange={handleChange}
        error={!!errors.car_number}
        helperText={errors.car_number}
        sx={{ 
          width: '100%'
        }}
        required
      />
      <FormControl 
        sx={{ 
          width: '100%'
        }}
      >
        <InputLabel>Цвет</InputLabel>
        <Select
          name="car_color"
          value={carData.car_color}
          label="Цвет"
          onChange={handleChange}
        >
          {CAR_COLORS.map((color) => (
            <MenuItem key={color.value} value={color.value}>
              {color.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        gridColumn: { 
          xs: '1 / -1', 
          md: 'span 2' 
        } 
      }}>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!isFormValid}
          sx={{ flexGrow: 1 }}
        >
          Добавить
        </Button>
        {onCancel && (
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={onCancel}
            sx={{ flexGrow: 1 }}
          >
            Отмена
          </Button>
        )}
      </Box>
    </Box>
  );
}
