import React from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import { TELEGRAM_CHATS, LIST_TELEGRAM_CHATS } from '../../config/telegramChats';

export default function ChatCheckboxList({ selectedChats, setSelectedChats }) {

  const handleToggle = (key) => {
    if (selectedChats.includes(key)) {
      setSelectedChats(selectedChats.filter((k) => k !== key));
    } else {
      setSelectedChats([...selectedChats, key]);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        {/* Получаем список чатов из LIST_TELEGRAM_CHATS.ADS_ALL и отображаем только их */}
        {Array.isArray(LIST_TELEGRAM_CHATS.ADS_ALL) && LIST_TELEGRAM_CHATS.ADS_ALL.map((chatObj) => {
          // Найти ключ этого чата в TELEGRAM_CHATS
          const key = Object.keys(TELEGRAM_CHATS).find(k => TELEGRAM_CHATS[k] === chatObj);
          if (!key || !chatObj) return null;
          return (
            <Grid item xs={12} md={12} key={key}>
              <Paper
                variant="outlined"
                sx={{ p: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleToggle(key)}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedChats.includes(key)}
                      onChange={() => handleToggle(key)}
                      onClick={e => e.stopPropagation()} // чтобы не срабатывал дважды
                    />
                  }
                  label={<Typography>{chatObj.name}</Typography>}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
