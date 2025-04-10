import React from 'react';
import { Chip } from '@mui/material';

const AnnouncementStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'archived':
        return 'default';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Активное';
      case 'archived':
        return 'В архиве';
      case 'draft':
        return 'Черновик';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
    />
  );
};

export default AnnouncementStatusBadge; 