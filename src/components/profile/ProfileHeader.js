import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  TextField 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ProfileHeader = ({ 
  firstName = '', 
  lastName = '', 
  onSaveName,
  currentUser = {},
  defaultAvatar
}) => {
  // Инициализация хуков всегда
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState(
    currentUser.telegram_first_name || firstName
  );
  const [editLastName, setEditLastName] = useState(
    currentUser.telegram_last_name || lastName
  );

  const handleSave = () => {
    onSaveName(editFirstName, editLastName);
    setIsEditing(false);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        borderRadius: 2 
      }}
    >
      <Avatar 
        alt={`Аватар ${currentUser.telegram_first_name || 'пользователя'}`}
        src={currentUser.avatar || defaultAvatar}
        sx={{ 
          width: 80, 
          height: 80, 
          mr: 2,
          border: '2px solid', 
          borderColor: 'primary.main' 
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <TextField
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton onClick={handleSave} color="primary">
              <CheckIcon />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)} color="error">
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                mr: 2 
              }}
            >
              {currentUser.telegram_first_name} {currentUser.telegram_last_name}
            </Typography>
            <IconButton 
              onClick={() => setIsEditing(true)} 
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileHeader;
