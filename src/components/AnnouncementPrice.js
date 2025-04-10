import React from 'react';
import { Typography } from '@mui/material';

const AnnouncementPrice = ({ price }) => {
  const formatPrice = (price) => {
    if (!price) return 'Цена не указана';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Typography variant="h6" color="primary">
      {formatPrice(price)}
    </Typography>
  );
};

export default AnnouncementPrice; 