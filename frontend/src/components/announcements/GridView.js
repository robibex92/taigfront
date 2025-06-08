import React from "react";
import { Grid } from "@mui/material";
import AnnouncementView from "./AnnouncementView";
import GridItemCard from "./GridItemCard";

const GridView = ({
  announcements = [],
  loading,
  isUserAnnouncementsPage = false,
  onRefreshAnnouncements,
}) => {
  const renderContent = ({
    announcements,
    handleUserView,
    handleNavigateToAnnouncement,
    isUserAnnouncementsPage,
    onRefreshAnnouncements,
  }) => (
    <Grid container spacing={2}>
      {announcements.filter(Boolean).map((announcement) => (
        <GridItemCard
          key={announcement.id}
          announcement={announcement}
          isUserAnnouncementsPage={isUserAnnouncementsPage}
          onRefreshAnnouncements={onRefreshAnnouncements}
          handleNavigateToAnnouncement={handleNavigateToAnnouncement}
          handleUserView={handleUserView}
        />
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

export default GridView;
