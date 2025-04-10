import React from 'react';
import { Container, Box } from '@mui/material';

const PageContainer = ({ children, ...props }) => {
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: { xs: 2, sm: 3, md: 4 },  // Адаптивные боковые отступы
        py: 3,  // Вертикальные отступы
        width: '100%',
        ...props.sx  // Возможность переопределения стилей
      }}
    >
      <Box 
        sx={{ 
          width: '100%', 
          minHeight: 'calc(100vh - 120px)' 
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default PageContainer;
