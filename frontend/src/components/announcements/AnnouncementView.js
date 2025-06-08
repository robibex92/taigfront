import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Chip, Avatar } from "@mui/material";

export const getUserDisplayName = (user) => {
  return user.is_manually_updated === "true"
    ? user.telegram_first_name || user.username
    : user.first_name || user.username;
};

export const UserAvatarChip = ({ user, onClick }) => {
  const displayName = getUserDisplayName(user);
  return (
    <Chip
      avatar={
        <Avatar src={user.avatar || "/default-avatar.png"} alt={displayName} />
      }
      label={displayName}
      onClick={onClick}
    />
  );
};

const AnnouncementView = ({
  announcements = [],
  loading,
  isUserAnnouncementsPage = false,
  onRefreshAnnouncements,
  renderContent,
}) => {
  const navigate = useNavigate();

  const handleUserView = (user) => {
    navigate(`/ads/user/${announcements[0]?.user_id}`);
  };

  const handleNavigateToAnnouncement = (announcementId) => {
    navigate(`/ads/${announcementId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Typography>Загрузка объявлений...</Typography>
      </Box>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
        Нет доступных объявлений
      </Typography>
    );
  }

  return renderContent({
    announcements,
    handleUserView,
    handleNavigateToAnnouncement,
    isUserAnnouncementsPage,
    onRefreshAnnouncements,
  });
};

export default AnnouncementView;
