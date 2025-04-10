import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { sendTelegramMessage } from '../utils/telegramMessageService';

const TelegramMessageDialog = ({ open, onClose, announcement }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendTelegramMessage(announcement.id, message);
      onClose();
    } catch (error) {
      setError(error.message || 'Ошибка при отправке сообщения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Отправить сообщение в Telegram</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Объявление: {announcement?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {announcement?.id}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Сообщение"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !message.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Отправить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TelegramMessageDialog;