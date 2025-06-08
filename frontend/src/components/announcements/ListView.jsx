import React from "react";
import { List } from "@mui/material";
import AnnouncementView from "./AnnouncementView";
import ListItemCard from "./ListItemCard";

const ListView = ({
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
    <List disablePadding>
      {announcements.filter(Boolean).map((announcement, idx, arr) => (
        <ListItemCard
          key={announcement.id}
          announcement={announcement}
          isUserAnnouncementsPage={isUserAnnouncementsPage}
          onRefreshAnnouncements={onRefreshAnnouncements}
          handleNavigateToAnnouncement={handleNavigateToAnnouncement}
          handleUserView={handleUserView}
          disableGutters
          sx={{ p: 0, mb: idx !== arr.length - 1 ? 2 : 0 }}
        />
      ))}
    </List>
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

export default ListView;
