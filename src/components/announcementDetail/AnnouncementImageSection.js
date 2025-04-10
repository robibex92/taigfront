import React from 'react';
import { Grid, Paper } from '@mui/material';
import AnnouncementImageSlider from '../AnnouncementImageSlider';

const AnnouncementImageSection = ({ announcement, currentUser, images }) => (
  <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
    <Paper 
      elevation={1} 
      sx={{ 
        width: '100%', 
        p: 2, 
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <AnnouncementImageSlider 
        announcement={announcement} 
        isUserAnnouncementsPage={currentUser?.id === announcement.user_id}
        images={images}
        sx={{ maxWidth: '100%', height: 'auto' }}
      />
    </Paper>
  </Grid>
);

export default AnnouncementImageSection;
