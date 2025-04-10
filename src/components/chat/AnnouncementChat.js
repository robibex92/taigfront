import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Avatar,
  IconButton
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { announcementApi } from '../../api/announcementApi';
import { useAuth } from '../../context/AuthContext';

const AnnouncementChat = ({ announcementId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [announcementId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const announcement = await announcementApi.getAnnouncement(announcementId);
      setMessages(announcement.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = {
        content: newMessage,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        timestamp: new Date().toISOString()
      };

      const updatedAnnouncement = await announcementApi.updateAnnouncement(announcementId, {
        messages: [...messages, message]
      });

      setMessages(updatedAnnouncement.messages);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (show notification, etc.)
    }
  };

  if (loading) {
    return <Typography>Загрузка сообщений...</Typography>;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flexGrow: 1, p: 2, mb: 2, overflow: 'auto' }}>
        <Stack spacing={2}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.userId === user.id ? 'flex-end' : 'flex-start',
                gap: 1
              }}
            >
              {message.userId !== user.id && (
                <Avatar src={message.userAvatar} alt={message.userName} />
              )}
              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.userId === user.id ? 'primary.main' : 'grey.100',
                  color: message.userId === user.id ? 'white' : 'text.primary',
                  p: 1,
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {message.userName}
                </Typography>
                <Typography variant="body1">
                  {message.content}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {new Date(message.timestamp).toLocaleString()}
                </Typography>
              </Box>
              {message.userId === user.id && (
                <Avatar src={message.userAvatar} alt={message.userName} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
      <form onSubmit={handleSendMessage}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            size="small"
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

export default AnnouncementChat;
