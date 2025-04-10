import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  TextField,
  useTheme
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';

const TelegramContactModal = ({ open, onClose, apartment }) => {
  const [message, setMessage] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleTelegramClick = () => {
    if (apartment?.id_telegram && message.trim()) {
      const telegramLink = `https://t.me/${apartment.id_telegram}?text=${encodeURIComponent(message)}`;
      window.open(telegramLink, '_blank');
      onClose();
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: isDarkMode ? '#424242' : undefined,
        }
      }}
    >
      <DialogTitle sx={{ color: isDarkMode ? '#000000' : undefined }}>
        <TelegramIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
        Написать владельцу квартиры
      </DialogTitle>
      <DialogContent>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2, 
            color: isDarkMode ? '#000000' : undefined 
          }}
        >
          Квартира № {apartment?.number}
        </Typography>
        {apartment?.id_telegram ? (
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Ваше сообщение"
            value={message}
            onChange={handleMessageChange}
            placeholder="Введите текст сообщения..."
            sx={{
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#000000' : undefined,
              },
              '& .MuiInputLabel-root': {
                color: isDarkMode ? '#000000' : undefined,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: isDarkMode ? '#000000' : undefined,
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#1976d2' : undefined,
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#1976d2' : undefined,
                },
              },
            }}
          />
        ) : (
          <Typography 
            variant="body2" 
            color="error"
            sx={{ color: isDarkMode ? '#ff0000' : undefined }}
          >
            Telegram не указан для этой квартиры
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="secondary"
          sx={{ 
            color: isDarkMode ? '#000000' : undefined,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : undefined,
            }
          }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleTelegramClick} 
          color="primary" 
          variant="contained"
          disabled={!apartment?.id_telegram || !message.trim()}
          startIcon={<TelegramIcon />}
          sx={{ 
            color: isDarkMode ? '#000000' : undefined,
            '&.Mui-disabled': {
              color: isDarkMode ? 'rgba(0,0,0,0.26)' : undefined,
            }
          }}
        >
          Отправить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TelegramContactModal;
