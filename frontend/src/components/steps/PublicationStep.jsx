import React, { useEffect } from 'react';
import { FormControlLabel, Checkbox, FormGroup, Alert } from '@mui/material';
import { TELEGRAM_CHATS, LIST_TELEGRAM_CHATS } from '../../config/telegramChats';

// Получаем ключ по объекту чата
function getChatKeyByObj(chatObj) {
  return Object.entries(TELEGRAM_CHATS).find(
    ([, chat]) => chat.id === chatObj.id && (chat.threadId || null) === (chatObj.threadId || null)
  )?.[0];
}

const ADS_ALL = LIST_TELEGRAM_CHATS.ADS_ALL || [];

const PublicationStep = ({ selectedChats, setSelectedChats }) => {
  // При первом рендере если selectedChats пуст, выбираем все чаты по умолчанию
  useEffect(() => {
    if (!selectedChats.length) {
      setSelectedChats(ADS_ALL.map(getChatKeyByObj).filter(Boolean));
    }
    // eslint-disable-next-line
  }, []);

  const handleToggle = (chatKey) => {
    if (selectedChats.includes(chatKey)) {
      setSelectedChats(selectedChats.filter((id) => id !== chatKey));
    } else {
      setSelectedChats([...selectedChats, chatKey]);
    }
  };

  return (
    <div>
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Выберите чаты для публикации объявления в Telegram.</strong><br />
        Все чаты выбраны по умолчанию.
      </Alert>
      <FormGroup>
        {ADS_ALL.map((chatObj) => {
          const chatKey = getChatKeyByObj(chatObj);
          return (
            <FormControlLabel
              key={chatObj.id + (chatObj.threadId || '')}
              control={
                <Checkbox
                  checked={selectedChats.includes(chatKey)}
                  onChange={() => handleToggle(chatKey)}
                />
              }
              label={chatObj.name + (chatObj.threadId ? ` (поток ${chatObj.threadId})` : '')}
            />
          );
        })}
      </FormGroup>
      {selectedChats.length === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Не выбрано ни одного чата — объявление будет создано только на сайте.
        </Alert>
      )}
    </div>
  );
};

export default PublicationStep;