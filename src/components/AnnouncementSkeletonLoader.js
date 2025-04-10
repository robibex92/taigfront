import React from 'react';
import { 
  Box, 
  Grid, 
  Skeleton 
} from '@mui/material';

const AnnouncementSkeletonLoader = ({ 
  itemCount = 20, 
  gridProps = {}, 
  itemProps = {} 
}) => {
  return (
    <Grid container spacing={2} {...gridProps}>
      {[...Array(itemCount)].map((_, index) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3} 
          key={index} 
          {...itemProps}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1 
          }}>
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={200} 
            />
            <Skeleton 
              variant="text" 
              width="80%" 
              height={40} 
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between' 
            }}>
              <Skeleton 
                variant="text" 
                width="40%" 
                height={30} 
              />
              <Skeleton 
                variant="text" 
                width="30%" 
                height={30} 
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnnouncementSkeletonLoader;
