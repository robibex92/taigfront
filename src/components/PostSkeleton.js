import React from 'react';
import { 
  Box,
  Skeleton
} from '@mui/material';

const PostSkeleton = () => {
  return (
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height={300} 
      animation="wave"
      sx={{ 
        mb: 2,
        borderRadius: 1
      }}
    />
  );
};

const PostSkeletonList = ({ count = 3 }) => {
  return (
    <Box>
      {Array.from(new Array(count)).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </Box>
  );
};

export { PostSkeleton, PostSkeletonList };
