import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Pagination
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { announcementApi } from '../api/announcementApi';
import { useAuth } from '../context/AuthContext';
import AnnouncementFilters from '../components/AnnouncementFilters';
import AnnouncementPagination from '../components/AnnouncementPagination';
import AnnouncementEmpty from '../components/AnnouncementEmpty';

const PublicAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    sort: 'created_at_desc',
    minPrice: '',
    maxPrice: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    loadAnnouncements();
  }, [filters, page]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementApi.getAnnouncements({
        ...filters,
        page,
        pageSize
      });
      setAnnouncements(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Error loading announcements:', error);
      setError('Ошибка при загрузке объявлений');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      status: 'active',
      sort: 'created_at_desc',
      minPrice: '',
      maxPrice: ''
    });
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Объявления
          </Typography>
          {user && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/announcements/new')}
            >
              Создать объявление
            </Button>
          )}
        </Box>

        <AnnouncementFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {announcements.length === 0 ? (
          <AnnouncementEmpty onAdd={() => navigate('/announcements/new')} />
        ) : (
          <>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {announcements.map((announcement) => (
                <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={announcement.imageUrl || '/placeholder.jpg'}
                      alt={announcement.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {announcement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {announcement.description.substring(0, 150)}
                        {announcement.description.length > 150 ? '...' : ''}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary">
                          {announcement.price === 'Не указано' ? 'Цена не указана' : `${announcement.price} ₽`}
                        </Typography>
                        <Chip
                          label={announcement.status === 'active' ? 'Активное' : 'В архиве'}
                          color={announcement.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <AnnouncementPagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              pageSize={pageSize}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default PublicAnnouncementsPage;
