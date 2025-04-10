import React from 'react';
import { Typography } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const AnnouncementDate = ({ date, format: dateFormat = 'relative' }) => {
  if (!date) return null;

  const formattedDate = dateFormat === 'relative'
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ru
      })
    : format(new Date(date), 'dd MMMM yyyy', { locale: ru });

  return (
    <Typography variant="body2" color="text.secondary">
      {formattedDate}
    </Typography>
  );
};

export default AnnouncementDate; 