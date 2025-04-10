import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AnnouncementEmpty = ({ onAdd }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Нет доступных объявлений
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Создайте свое первое объявление или измените параметры фильтрации
      </Typography>
      {onAdd && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Создать объявление
        </Button>
      )}
    </Box>
  );
};

export default AnnouncementEmpty; 