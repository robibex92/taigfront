import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Button, useTheme, Snackbar, Alert } from '@mui/material';
import { NavigateBefore as PrevIcon, NavigateNext as NextIcon, Telegram as TelegramIcon } from '@mui/icons-material';
import RussianLicensePlate from './RussianLicensePlate';
import { getRussianColorName } from '../utils/colorUtils';
import MessageDialog from './MessageDialog';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/config';

const CarInfoCard = ({ cars }) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [msgDialogOpen, setMsgDialogOpen] = useState(false);


  // Если машин нет, возвращаем null
  if (!cars || cars.length === 0) {
    return null;
  }

  const currentCar = cars[currentCarIndex];



  const handleCopyNumber = (rawNumber) => {
    navigator.clipboard.writeText(rawNumber);
  };

  return (
    <Card sx={{ maxWidth: 300, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'stretch', height: 'auto', minHeight: 200, maxHeight: { xs: 350, sm: 250 }, position: 'relative' }}>
      <CardContent sx={{ flex: 1, display: 'grid', flexDirection: 'column', gap: 2, position: 'relative', pr: { xs: 2, sm: 2 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', height: '100%' }}>
          <RussianLicensePlate number={currentCar.car_number} onClick={handleCopyNumber} sx={{ mb: 2 }}  />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Марка:</Typography>
            <Typography variant="body2">{currentCar.car_brand || 'Не указана'}</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Модель:</Typography>
            <Typography variant="body2">{currentCar.car_model || 'Не указана'}</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Цвет:</Typography>
            <Typography variant="body2">{getRussianColorName(currentCar.car_color) || 'Не указан'}</Typography>
          </Box>
          {cars.length > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
              <IconButton size="small" disabled={currentCarIndex === 0} onClick={() => setCurrentCarIndex(prev => Math.max(0, prev - 1))}><PrevIcon fontSize="small" /></IconButton>
              <Typography variant="caption" color="text.secondary">{currentCarIndex + 1} из {cars.length}</Typography>
              <IconButton size="small" disabled={currentCarIndex === cars.length - 1} onClick={() => setCurrentCarIndex(prev => Math.min(cars.length - 1, prev + 1))}><NextIcon fontSize="small" /></IconButton>
            </Box>
          )}
          {currentCar.parking_spot && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Парковка:</Typography>
              <Typography variant="body2">{currentCar.parking_spot}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
      {/* Vertical Telegram Button */}
      <Box sx={{ width: 50, display: 'flex', alignItems: 'stretch', justifyContent: 'center', backgroundColor: theme.palette.primary.light, writingMode: 'vertical-rl', textOrientation: 'mixed', p: 0 }}>
        <Button
          onClick={() => setMsgDialogOpen(true)}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 0,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            m: 0,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontWeight: 'bold',
            fontSize: 16,
            gap: 1,
            background: 'none',
            boxShadow: 'none',
            textTransform: 'none',
            color: 'inherit', // do not force color for icon
          }}
        >
          <TelegramIcon sx={{ fontSize: 28, mb: 1, color: undefined }} />
          <span style={{fontSize: 11}}>Telegram</span>
        </Button>
      </Box>
      
      <MessageDialog
        open={msgDialogOpen}
        onClose={() => setMsgDialogOpen(false)}
        targetChatId={currentCar?.user_id}
        contextType="car"
        contextData={{ car_brand: currentCar?.car_brand, car_model: currentCar?.car_model }}
        isAuthenticated={isAuthenticated}
      />
    </Card>
  );
};

export default CarInfoCard;