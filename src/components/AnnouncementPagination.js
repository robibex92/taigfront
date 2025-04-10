import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  Stack
} from '@mui/material';

const AnnouncementPagination = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
  pageSize
}) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <Box sx={{ mt: 3 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Показано {startItem}-{endItem} из {totalItems} объявлений
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Stack>
    </Box>
  );
};

export default AnnouncementPagination; 