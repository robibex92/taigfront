import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

const ImageGallery = ({
  images,
  canDelete = false,
  canSetMain = false,
  onDelete,
  onSetMain
}) => {
  if (!images?.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Нет доступных изображений
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {images.map((image, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={image.url}
              alt={`Изображение ${index + 1}`}
              sx={{ objectFit: 'cover' }}
            />
            {(canDelete || canSetMain) && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 1,
                  padding: 0.5
                }}
              >
                {canSetMain && (
                  <IconButton
                    size="small"
                    onClick={() => onSetMain(index)}
                    color="primary"
                  >
                    {image.isMain ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                )}
                {canDelete && (
                  <IconButton
                    size="small"
                    onClick={() => onDelete(image.url)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGallery; 