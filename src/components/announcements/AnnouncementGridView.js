import React from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box
} from '@mui/material';
import AnnouncementImageSlider from './AnnouncementImageSlider';
import AnnouncementView, { UserAvatarChip } from './AnnouncementView';

const AnnouncementGridView = ({ 
  announcements = [], 
  loading, 
  isUserAnnouncementsPage = false,
  onRefreshAnnouncements
}) => {
  const renderContent = ({
    announcements,
    handleImageSlide,
    handleUserView,
    handleNavigateToAnnouncement,
    isUserAnnouncementsPage,
    onRefreshAnnouncements,
  }) => (
    <Grid container spacing={2}>
      {announcements.map((announcement) => (
        <Grid 
          item 
          key={announcement.id} 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3}
        >
          <Card 
            className="announcement-card"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%', 
              height: '100%',
              transition: 'box-shadow 0.3s, transform 0.3s, opacity 0.3s',
              boxShadow: 1,
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              }
            }}
            onClick={() => handleNavigateToAnnouncement(announcement.id)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
              <AnnouncementImageSlider
                announcementId={announcement.id} // Pass only the announcementId
                isUserAnnouncementsPage={isUserAnnouncementsPage}
                onRefreshAnnouncements={onRefreshAnnouncements}
              />
            </Box>
            
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  mb: 1 
                }}
              >
                {announcement.title}
              </Typography>
              
              {announcement.price !== null ? (
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  {announcement.price} ₽
                </Typography>
              ) : (
                <Typography variant="h6" color="secondary" sx={{ 
                  mb: 1, 
                  fontStyle: 'italic', 
                  color: 'text.secondary' 
                }}>
                  Цена не указана
                </Typography>
              )}
              
              {announcement.users && (
                <Box 
                  sx={{ 
                    mt: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-start'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserView(announcement.users);
                  }}
                >
                  <UserAvatarChip 
                    user={announcement.users} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserView(announcement.users);
                    }}
                    
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <AnnouncementView
      announcements={announcements}
      loading={loading}
      isUserAnnouncementsPage={isUserAnnouncementsPage}
      onRefreshAnnouncements={onRefreshAnnouncements}
      renderContent={renderContent}
    />
  );
};

export default AnnouncementGridView;
