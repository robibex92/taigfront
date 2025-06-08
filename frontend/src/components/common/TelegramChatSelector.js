import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { TELEGRAM_CHATS, LIST_TELEGRAM_CHATS } from '../../config/telegramChats';

const TelegramChatSelector = ({ selectedChats, setSelectedChats, chatGroupKey = 'ADS_ALL', label = 'Telegram-чаты для отправки' }) => {
  // Получить список чатов по ключу группы
  const chats = (LIST_TELEGRAM_CHATS && LIST_TELEGRAM_CHATS[chatGroupKey]) || [];
  const chatKeyMap = Object.entries(TELEGRAM_CHATS).reduce((acc, [key, obj]) => {
    acc[obj.id + (obj.threadId ? `:${obj.threadId}` : '')] = key;
    return acc;
  }, {});

  // Получить ключи для Select
  const chatKeys = chats.map(chat => chatKeyMap[chat.id + (chat.threadId ? `:${chat.threadId}` : '')]).filter(Boolean);

  return (
    <FormControl fullWidth>
      <InputLabel id="select-chats-label">{label}</InputLabel>
      <Select
        labelId="select-chats-label"
        multiple
        value={selectedChats}
        onChange={e => setSelectedChats(e.target.value)}
        renderValue={selected => selected.map(key => TELEGRAM_CHATS[key]?.name || key).join(', ')}
        label={label}
      >
        {chatKeys.map(key => (
          <MenuItem key={key} value={key}>
            <Checkbox checked={selectedChats.includes(key)} />
            <ListItemText primary={TELEGRAM_CHATS[key]?.name || key} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TelegramChatSelector;
