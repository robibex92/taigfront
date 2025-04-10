import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loader = ({ size = 40, color = 'primary', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={size} color={color} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default Loader; 