import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const AnnouncementTitle = ({ title }) => (
  <Grid item xs={12} sx={{ mb: 3 }}>
    <Paper elevation={1} sx={{ 
      p: 2, 
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: 2 
    }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          fontWeight: 'bold',
          color: 'text.primary' 
        }}
      >
        {title}
      </Typography>
    </Paper>
  </Grid>
);

export default AnnouncementTitle;
