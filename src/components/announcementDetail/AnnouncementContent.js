import React from 'react';
import { Box, Typography, Chip, Paper, Divider, Skeleton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AnnouncementContent = ({ 
  announcement, 
  viewCount,
  isViewCountLoading
}) => (
  <Paper elevation={1} sx={{ p: 3 }}>
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      alignItems: 'center', 
      mb: 2 
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        flexGrow: 1,
        gap: 1,
        alignItems: 'center'
      }}>
        {announcement.category && (
          <Chip 
            label={`Категория: ${announcement.category}`} 
            variant="outlined" 
            sx={{ 
              mb: 1,
              '& .MuiChip-label': {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textOverflow: 'clip',
                maxWidth: '100%',
                display: 'inline-block'
              }
            }} 
          />
        )}
        {announcement.subcategory && (
          <Chip 
            label={`Подкатегория: ${announcement.subcategory}`} 
            variant="outlined" 
            sx={{ 
              mb: 1,
              '& .MuiChip-label': {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textOverflow: 'clip',
                maxWidth: '100%',
                display: 'inline-block'
              }
            }}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VisibilityIcon fontSize="small" color="action" />
        {isViewCountLoading ? (
          <Skeleton width={60} height={24} sx={{ display: 'inline-block' }} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {viewCount} {viewCount === 1 ? 'просмотр' : 
                       viewCount > 1 && viewCount < 5 ? 'просмотра' : 
                       'просмотров'}
          </Typography>
        )}
      </Box>
    </Box>

    <Divider textAlign="left" sx={{ my: 2 }}>Описание объявления</Divider>

    <Typography 
      variant="body1" 
      sx={{ 
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 2
      }}
    >
      {announcement.content}
    </Typography>
  </Paper>
);

export default AnnouncementContent;
