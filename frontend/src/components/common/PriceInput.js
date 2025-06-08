import React from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
} from "@mui/material";

const PriceInput = ({
  price,
  onPriceChange,
  isPriceNotSpecified,
  onPriceNotSpecifiedChange,
  onBlur,
  error,
  helperText,
}) => {
  const formatPrice = (value) => {
    if (!value || value === "Не указано") return "";
    const cleanValue = value.toString().replace(/\D/g, "");
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 7); // максимум 7 цифр
    onPriceChange(value);
  };

  const handlePriceNotSpecifiedChange = (e) => {
    const checked = e.target.checked;
    onPriceNotSpecifiedChange(checked);
    onPriceChange(checked ? "" : "0"); // Сбрасываем на "0" при выключении
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            label="Цена"
            value={formatPrice(price)}
            onChange={handlePriceChange}
            onBlur={onBlur}
            disabled={isPriceNotSpecified}
            error={error}
            helperText={helperText}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9 ]*",
              maxLength: 9,
            }}
            InputProps={{
              endAdornment: !isPriceNotSpecified && <span>₽</span>,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PriceInput;
