import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  InputAdornment,
  IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Регулярное выражение для российского автомобильного номера
const RUSSIAN_CAR_NUMBER_REGEX = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/i;

const SearchForm = ({ 
  carNumber, 
  onCarNumberChange, 
  onSearch, 
  onClear, 
  error 
}) => {
  // Обработчик изменения номера автомобиля
  const handleCarNumberChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/\s/g, '');
    onCarNumberChange(value, value === '' || RUSSIAN_CAR_NUMBER_REGEX.test(value));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2,
      mb: 4,
      alignItems: { xs: 'stretch', sm: 'center' }
    }}>
      <TextField
        fullWidth
        label="Номер автомобиля"
        value={carNumber}
        onChange={handleCarNumberChange}
        error={error}
        helperText={error ? "Неверный формат номера" : ""}
        InputProps={{
          endAdornment: carNumber && (
            <InputAdornment position="end">
              <IconButton onClick={onClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={!carNumber || error}
        startIcon={<SearchIcon />}
        sx={{ 
          minWidth: { xs: '100%', sm: '150px' }
        }}
      >
        Найти
      </Button>
    </Box>
  );
};

export default SearchForm;
