import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack
} from '@mui/material';
import AnnouncementFileUploader from './AnnouncementFileUploader';

const AnnouncementForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    status: initialData?.status || 'active',
    images: initialData?.images || []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleImageDelete = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.url !== imageUrl)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({
          title: '',
          description: '',
          price: '',
          status: 'active',
          images: []
        });
      }
    } catch (error) {
      setError(error.message || 'Произошла ошибка при сохранении объявления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Заголовок"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
        />

        <TextField
          required
          fullWidth
          multiline
          rows={4}
          label="Описание"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
        />

        <TextField
          required
          fullWidth
          type="number"
          label="Цена"
          name="price"
          value={formData.price}
          onChange={handleChange}
          disabled={loading}
        />

        <FormControl fullWidth>
          <InputLabel>Статус</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Статус"
            disabled={loading}
          >
            <MenuItem value="active">Активное</MenuItem>
            <MenuItem value="archived">В архиве</MenuItem>
            <MenuItem value="draft">Черновик</MenuItem>
          </Select>
        </FormControl>

        <AnnouncementFileUploader
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          images={formData.images}
        />

        {error && (
          <Typography color="error">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : initialData ? 'Сохранить изменения' : 'Создать объявление'}
        </Button>
      </Stack>
    </Box>
  );
};

export default AnnouncementForm; 