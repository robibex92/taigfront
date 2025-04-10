import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AnnouncementFileUploader from '../AnnouncementFileUploader';

const ImageUploadSection = ({
  images,
  setImages,
  mainImageIndex,
  setMainImageIndex,
  isEdit,
  adId,
  showSnackbar
}) => {
  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages);
  };

  const handleMainImageChange = (index) => {
    setMainImageIndex(index);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Изображения
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AnnouncementFileUploader
            adId={adId}
            adImages={images.map(url => ({ image_url: url }))}
            onImagesChange={handleImageUpload}
            mainImageIndex={mainImageIndex}
            onMainImageChange={handleMainImageChange}
            showSnackbar={showSnackbar}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageUploadSection;
