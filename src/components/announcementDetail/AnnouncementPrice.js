import React from 'react';
import { Typography } from '@mui/material';

const AnnouncementPrice = ({ formattedPrice }) => (
  <Typography 
    variant="h5" 
    color="primary" 
    sx={{ 
      fontWeight: 'bold', 
      p: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: 2,
      textAlign: 'center'
    }}
  >
    {formattedPrice}
  </Typography>
);

export default AnnouncementPrice;
