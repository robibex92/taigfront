import React from "react";
import { Typography, Box, Card, CardContent, ListItem } from "@mui/material";
import AnnouncementImageSlider from "./AnnouncementImageSlider";
import AuthorCard from "../announcementDetail/AuthorCard";

import EditAnnouncementModal from "../EditAnnouncementModal";

const ListItemCard = ({
  announcement,
  isUserAnnouncementsPage,
  onRefreshAnnouncements,
  handleNavigateToAnnouncement,
  handleUserView,
  disableGutters = false,
  sx = { p: 0 },
}) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleAuthorCardClick = (e) => {
    e.stopPropagation();
    handleUserView(announcement.user_id);
  };

  return (
    <ListItem
      component="div"
      onClick={() => handleNavigateToAnnouncement(announcement.id)}
      disableGutters={disableGutters}
      sx={sx}
    >
      <Card
        sx={{
          display: "flex",
          width: "100%",
          maxHeight: 300,
          transition: "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
          boxShadow: 1,
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 3,
          },
        }}
      >
        <AnnouncementImageSlider
          announcementId={announcement.id || announcement._id}
          isUserAnnouncementsPage={isUserAnnouncementsPage}
          onEditAnnouncement={handleEditClick}
        />

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mb: 0.5,
            }}
          >
            {announcement.title}
          </Typography>

          <Typography
            variant="subtitle2"
            color={announcement.price !== null ? "primary" : "text.secondary"}
            sx={{
              mb: 0.5,
              fontStyle: announcement.price === null ? "italic" : "normal",
            }}
          >
            {announcement.price !== null
              ? `${announcement.price} ₽`
              : "Цена не указана"}
          </Typography>

          {announcement.user_id && (
            <Box
              sx={{
                mt: "auto",
                display: "flex",
                justifyContent: "flex-start",
              }}
              onClick={handleAuthorCardClick}
            >
              <AuthorCard user_id={announcement.user_id} />
            </Box>
          )}
        </CardContent>
      </Card>
      {editModalOpen && (
        <EditAnnouncementModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          initialAnnouncement={announcement}
          onUpdated={() => {
            handleCloseEditModal();
            if (typeof onRefreshAnnouncements === "function") {
              onRefreshAnnouncements("update", announcement.id);
            }
          }}
          onDelete={() => {
            handleCloseEditModal();
            if (typeof onRefreshAnnouncements === "function") {
              onRefreshAnnouncements("delete", announcement.id);
            }
          }}
          onArchive={() => {
            handleCloseEditModal();
            onRefreshAnnouncements &&
              onRefreshAnnouncements("archive", announcement.id);
          }}
          onExtend={handleCloseEditModal}
        />
      )}
    </ListItem>
  );
};

export default ListItemCard;
