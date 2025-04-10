import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const AnnouncementFilters = ({
  filters,
  onFilterChange,
  onSearch,
  onReset
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange(name, value);
  };

  const handleSearch = () => {
    onSearch();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            name="search"
            label="Поиск"
            value={filters.search || ''}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <Tooltip title="Поиск">
            <IconButton
              onClick={handleSearch}
              color="primary"
              size="small"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Сбросить фильтры">
            <IconButton
              onClick={handleReset}
              color="error"
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={filters.status || ''}
              onChange={handleChange}
              label="Статус"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="active">Активные</MenuItem>
              <MenuItem value="archived">В архиве</MenuItem>
              <MenuItem value="draft">Черновики</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Сортировка</InputLabel>
            <Select
              name="sort"
              value={filters.sort || ''}
              onChange={handleChange}
              label="Сортировка"
            >
              <MenuItem value="">По умолчанию</MenuItem>
              <MenuItem value="price_asc">Цена (по возрастанию)</MenuItem>
              <MenuItem value="price_desc">Цена (по убыванию)</MenuItem>
              <MenuItem value="date_desc">Дата (новые)</MenuItem>
              <MenuItem value="date_asc">Дата (старые)</MenuItem>
              <MenuItem value="views_desc">Просмотры (по убыванию)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="minPrice"
            label="Мин. цена"
            type="number"
            value={filters.minPrice || ''}
            onChange={handleChange}
            size="small"
            sx={{ width: 150 }}
          />

          <TextField
            name="maxPrice"
            label="Макс. цена"
            type="number"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            size="small"
            sx={{ width: 150 }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default AnnouncementFilters; 