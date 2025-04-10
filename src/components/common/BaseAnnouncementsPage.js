import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  useMediaQuery,
  useTheme,
  Pagination,
  Snackbar,
  Alert
} from '@mui/material';
import AnnouncementGridView from '../AnnouncementGridView';
import AnnouncementListView from '../AnnouncementListView';
import AnnouncementSkeletonLoader from '../AnnouncementSkeletonLoader';
import AnnouncementViewControls from '../AnnouncementViewControls';

const BaseAnnouncementsPage = ({
  title,
  announcements,
  isLoading,
  onEditAnnouncement,
  onOpenAnnouncement,
  onDeleteAnnouncement,
  onRefreshAnnouncements,
  isUserAnnouncementsPage,
  actions,
  tabs
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const ITEMS_PER_PAGE = 20;

  // Сортировка объявлений
  const sortedAnnouncements = useCallback(() => {
    let result = [...announcements];

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'cheapest':
        result.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
        break;
      case 'mostExpensive':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return result;
  }, [announcements, sortBy]);

  // Пагинация
  const paginatedAnnouncements = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedAnnouncements().slice(startIndex, endIndex);
  }, [sortedAnnouncements, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h4">{title}</Typography>
        {actions}
      </Box>

      {tabs}

      <AnnouncementViewControls 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isMobile={isMobile}
        sx={{ 
          marginTop: 4,  
          marginBottom: 2 
        }}
      />

      {isLoading ? (
        <AnnouncementSkeletonLoader />
      ) : (
        <>
          {paginatedAnnouncements().length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <AnnouncementGridView 
                  announcements={paginatedAnnouncements()}
                  onEditAnnouncement={onEditAnnouncement}
                  onOpenAnnouncement={onOpenAnnouncement}
                  onDeleteAnnouncement={onDeleteAnnouncement}
                  isUserAnnouncementsPage={isUserAnnouncementsPage}
                  onRefreshAnnouncements={onRefreshAnnouncements}
                />
              ) : (
                <AnnouncementListView 
                  announcements={paginatedAnnouncements()}
                  onEditAnnouncement={onEditAnnouncement}
                  onOpenAnnouncement={onOpenAnnouncement}
                  onDeleteAnnouncement={onDeleteAnnouncement}
                  isUserAnnouncementsPage={isUserAnnouncementsPage}
                  onRefreshAnnouncements={onRefreshAnnouncements}
                />
              )}

              {sortedAnnouncements().length > ITEMS_PER_PAGE && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 4, 
                  mb: 4 
                }}>
                  <Pagination 
                    count={Math.ceil(sortedAnnouncements().length / ITEMS_PER_PAGE)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              Нет объявлений
            </Typography>
          )}
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BaseAnnouncementsPage;
