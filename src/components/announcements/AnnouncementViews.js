import React from 'react';
import { Box, Typography } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const AnnouncementViews = ({ views = 0 }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <VisibilityIcon fontSize="small" color="action" />
      <Typography variant="body2" color="text.secondary">
        {formatViews(views)} просмотров
      </Typography>
    </Box>
  );
};

export default AnnouncementViews; 