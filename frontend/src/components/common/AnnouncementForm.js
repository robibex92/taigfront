import React from 'react';
import {
  TextField,
  Grid,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import PriceInput from './PriceInput';

const AnnouncementForm = ({
  title,
  setTitle,
  content,
  setContent,
  price,
  setPrice,
  isPriceNotSpecified,
  setIsPriceNotSpecified,

  isLoading,
  snackbarOpen,
  snackbarMessage,
  snackbarSeverity,
  onSnackbarClose,

}) => {
  return (
    <Box sx={{ position: 'relative', minHeight: 'unset', overflow: 'visible' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ overflow: 'visible' }}>
          <TextField
            fullWidth
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ overflow: 'visible' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Описание"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={4}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <PriceInput
            price={price}
            onPriceChange={setPrice}
            isPriceNotSpecified={isPriceNotSpecified}
            onPriceNotSpecifiedChange={setIsPriceNotSpecified}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={onSnackbarClose}
      >
        <Alert
          onClose={onSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(AnnouncementForm);
