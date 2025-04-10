import React, { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { imageApi } from '../services/imageApi';

const AnnouncementFileUploader = ({ onImageUpload, onImageDelete, images = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const uploadedImages = await imageApi.uploadMultiple(formData);
      onImageUpload(uploadedImages);
    } catch (error) {
      setError(error.message || 'Ошибка при загрузке изображений');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageUrl) => {
    try {
      await imageApi.delete(imageUrl);
      onImageDelete(imageUrl);
    } catch (error) {
      setError(error.message || 'Ошибка при удалении изображения');
    }
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        multiple
        type="file"
        onChange={handleFileChange}
        disabled={loading}
      />
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          disabled={loading}
        >
          Загрузить изображения
        </Button>
      </label>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {images.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 1
                }
              }}
            >
              <img src={image.url} alt={`Изображение ${index + 1}`} />
              <IconButton
                size="small"
                onClick={() => handleDelete(image.url)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AnnouncementFileUploader;
