import React, { useState } from 'react';
import { Paper, Box, Typography, Tooltip } from '@mui/material';

const RussianLicensePlate = ({ number, onClick }) => {
  const [tooltipText, setTooltipText] = useState('Скопировать');

  // Форматируем номер для отображения (с пробелами)
  const formatDisplayNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '').toUpperCase();
    const match = cleanNumber.match(/^([А-Я])(\d{3})([А-Я]{2})(\d+)$/);
    if (!match) return number;
    
    const [_, first, digits, letters, region] = match;
    return {
      first,
      digits,
      letters,
      region: region.padStart(2, '0')
    };
  };

  // Получаем чистый номер для копирования (без пробелов)
  const getRawNumber = () => number.replace(/\s/g, '').toUpperCase();

  const { first, digits, letters, region } = formatDisplayNumber(number);

  const handleCopy = () => {
    navigator.clipboard.writeText(getRawNumber());
    setTooltipText('Скопировано!');
    setTimeout(() => setTooltipText('Скопировать'), 2000);
  };

  return (
    <Tooltip title={tooltipText} arrow>
      <Paper 
        variant="outlined" 
        onClick={handleCopy}
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          height: 38,
          backgroundColor: '#fff',
          border: '2px solid #000',
          borderRadius: '4px',
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          overflow: 'hidden',
          width: 'fit-content',
          maxWidth: 'auto'
        }}
      >
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          px: 1,
          '& > span': {
            fontFamily: 'RoadNumbers, Arial',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            letterSpacing: '1px'
            // Цвет не указываем — пусть будет по умолчанию (чёрный)
          }
        }}>
          <Typography component="span" sx={{ color: '#111' }}>{first}</Typography>
          <Typography component="span" sx={{ ml: 1, color: '#111' }}>{digits}</Typography>
          <Typography component="span" sx={{ ml: 1, color: '#111' }}>{letters}</Typography>
        </Box>
        <Box sx={{
          borderLeft: '2px solid #000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 40,
          padding: '2px 4px',
          flexShrink: 0,
        }}>
          <Typography
            sx={{ 
              fontFamily: 'RoadNumbers, Arial',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {region}
          </Typography>
          <Box
            sx={{
              height: 12,
              width: 24,
              display: 'flex',
              flexDirection: 'column',
              marginTop: '2px',
            }}
          >
            <Box sx={{ height: '33.33%', backgroundColor: '#fff' }} />
            <Box sx={{ height: '33.33%', backgroundColor: '#0039A6' }} />
            <Box sx={{ height: '33.33%', backgroundColor: '#D52B1E' }} />
          </Box>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default RussianLicensePlate;
