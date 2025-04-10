import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  useTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';

const CarSchemeVariants = () => {
  const theme = useTheme();

  const CarScheme = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '120px',
    border: `1px dashed ${theme.palette.text.secondary}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  }));

  const carVariants = [
    {
      title: 'Минималистичный контур',
      render: () => (
        <CarScheme>
          <svg width="80" height="40" viewBox="0 0 80 40">
            <rect x="10" y="10" width="60" height="20" 
              fill="none" 
              stroke={theme.palette.text.secondary} 
              strokeWidth="2" 
            />
            <circle cx="20" cy="30" r="5" 
              fill={theme.palette.text.secondary} 
            />
            <circle cx="60" cy="30" r="5" 
              fill={theme.palette.text.secondary} 
            />
          </svg>
        </CarScheme>
      )
    },
    {
      title: 'Геометрический силуэт',
      render: () => (
        <CarScheme>
          <svg width="80" height="40" viewBox="0 0 80 40">
            <path 
              d="M15,30 Q40,10 65,30 L65,35 Q40,25 15,35 Z" 
              fill={theme.palette.text.disabled} 
            />
          </svg>
        </CarScheme>
      )
    },
    {
      title: 'Пиктограмма',
      render: () => (
        <CarScheme>
          <svg width="60" height="40" viewBox="0 0 60 40">
            <path 
              d="M10,30 L20,10 L40,10 L50,30 
                 M15,30 A5,5 0 1,0 25,30 
                 M35,30 A5,5 0 1,0 45,30" 
              fill="none" 
              stroke={theme.palette.text.secondary} 
              strokeWidth="2" 
            />
          </svg>
        </CarScheme>
      )
    },
    {
      title: 'Абстрактная форма',
      render: () => (
        <CarScheme>
          <svg width="80" height="40" viewBox="0 0 80 40">
            <polygon 
              points="20,10 60,10 70,25 60,35 20,35 10,25" 
              fill={theme.palette.text.disabled} 
              fillOpacity="0.3" 
            />
          </svg>
        </CarScheme>
      )
    },
    {
      title: 'Технический эскиз',
      render: () => (
        <CarScheme>
          <svg width="80" height="40" viewBox="0 0 80 40">
            <path 
              d="M15,30 C25,15 55,15 65,30" 
              fill="none" 
              stroke={theme.palette.text.secondary} 
              strokeWidth="2" 
              strokeDasharray="4,2" 
            />
            <circle cx="20" cy="30" r="3" 
              fill={theme.palette.text.secondary} 
            />
            <circle cx="60" cy="30" r="3" 
              fill={theme.palette.text.secondary} 
            />
          </svg>
        </CarScheme>
      )
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Варианты схематичного изображения машины
      </Typography>
      <Grid container spacing={3}>
        {carVariants.map((variant, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {variant.title}
              </Typography>
              {variant.render()}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CarSchemeVariants;
