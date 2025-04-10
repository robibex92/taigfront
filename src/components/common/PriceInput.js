import React from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';

const PriceInput = ({
  price,
  onPriceChange,
  isPriceNotSpecified,
  onPriceNotSpecifiedChange
}) => {
  const formatPrice = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handlePriceChange = (e) => {
    if (!isPriceNotSpecified) {
      const formattedPrice = formatPrice(e.target.value);
      onPriceChange(formattedPrice);
    }
  };

  const handlePriceNotSpecifiedChange = (e) => {
    const checked = e.target.checked;
    onPriceNotSpecifiedChange(checked);
    
    if (checked) {
      onPriceChange('Не указано');
    } else {
      onPriceChange('');
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Цена"
          value={price}
          onChange={handlePriceChange}
          disabled={isPriceNotSpecified}
          InputProps={{
            endAdornment: !isPriceNotSpecified && <span>₽</span>
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPriceNotSpecified}
              onChange={handlePriceNotSpecifiedChange}
            />
          }
          label="Цена не указана"
        />
      </Grid>
    </Grid>
  );
};

export default PriceInput;
