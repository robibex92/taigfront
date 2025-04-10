import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton, 
  useTheme 
} from '@mui/material';
import { 
  NavigateBefore as PrevIcon, 
  NavigateNext as NextIcon,
  Telegram as TelegramIcon
} from '@mui/icons-material';
import TelegramMessageDialog from '../TelegramMessageDialog';
import RussianLicensePlate from '../../components/common/RussianLicensePlate';

const CarInfoCard = ({ cars }) => {
  const theme = useTheme();
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [isTelegramDialogOpen, setIsTelegramDialogOpen] = useState(false);

  // Если машин нет, возвращаем null
  if (!cars || cars.length === 0) {
    return null;
  }

  const currentCar = cars[currentCarIndex];

  const handleSendTelegramMessage = (message, recipientId) => {
    // Здесь логика отправки сообщения в Telegram
    console.log(`Отправка сообщения ${message} пользователю ${recipientId}`);
  };
  const handleCopyNumber = (rawNumber) => {
    navigator.clipboard.writeText(rawNumber);
  };
  return (
    <Card 
      sx={{ 
        maxWidth: 300,
        width: '100%',
        margin: '0 auto',
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 'auto',
        minHeight: 200,
        maxHeight: { xs: 350, sm: 250 },
        position: 'relative'
      }}
    >
      {/* Car Content */}
      <CardContent 
        sx={{ 
          flex: 1, 
          display: 'grid',
          flexDirection: 'column',
          gap: 2,
          position: 'relative',
          pr: { xs: 2, sm: 2 }
        }}
      >
        {/* First Column */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          position: 'relative',
          height: '100%'
        }}>
          <RussianLicensePlate 
              number={currentCar.car_number} 
              onClick={handleCopyNumber}
              sx={{ mb: 2 }}  
            />
           </Box>

        {/* Second Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Марка */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Марка:</Typography>
            <Typography variant="body2">
              {currentCar.car_brand || 'Не указана'}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Модель:</Typography>
            <Typography variant="body2">
              {currentCar.car_model || 'Не указана'}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">Цвет:</Typography>
            <Typography variant="body2">
              {currentCar.car_color || 'Не указан'}
            </Typography>
          </Box>
          {/* Navigation Buttons */}
          {cars.length > 1 && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                width: '100%',
                mt: 2
              }}
            >
              <IconButton 
                size="small"
                disabled={currentCarIndex === 0}
                onClick={() => setCurrentCarIndex(prev => Math.max(0, prev - 1))}
              >
                <PrevIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {currentCarIndex + 1} из {cars.length}
              </Typography>
              <IconButton 
                size="small"
                disabled={currentCarIndex === cars.length - 1}
                onClick={() => setCurrentCarIndex(prev => Math.min(cars.length - 1, prev + 1))}
              >
                <NextIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          {currentCar.parking_spot && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">Парковка:</Typography>
              <Typography variant="body2">
                {currentCar.parking_spot}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Vertical Telegram Button */}
      <Box 
        sx={{ 
          width: 50,
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.primary.light,
          writingMode: 'vertical-rl',
          textOrientation: 'mixed'
        }}
        onClick={() => setIsTelegramDialogOpen(true)}
      >
        <IconButton 
          sx={{ 
            color: 'white'
          }}
        >
          <TelegramIcon />
        </IconButton>
      </Box>

      {/* Telegram Dialog */}
      <TelegramMessageDialog 
        open={isTelegramDialogOpen}
        onClose={() => setIsTelegramDialogOpen(false)}
        onSend={handleSendTelegramMessage}
        recipientId={currentCar.user_id}
        contextType="car"
        contextId={currentCar.id}
        recipientName={`владельцу автомобиля ${currentCar.car_brand} ${currentCar.car_model}`}
        announcementTitle={`${currentCar.car_brand} ${currentCar.car_model} (${currentCar.car_number})`}
      />
    </Card>
  );
};

export default CarInfoCard;