import React from 'react';
import { Typography, Alert } from '@mui/material';
import PageContainer from '../components/common/PageContainer';
import ParkingScheme from '../components/whoseCar/ParkingScheme';

const WhoseCar = () => {
  return (
    <PageContainer>
      <Alert severity="info" sx={{ mb: 2 }}>
        Страница находится в разработке. Содержимое может быть неполным или изменяться.
      </Alert>
      <ParkingScheme />
    </PageContainer>
  );
};

export default WhoseCar;