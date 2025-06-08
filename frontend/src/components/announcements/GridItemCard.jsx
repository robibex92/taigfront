import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
} from "@mui/material";
import AnnouncementImageSlider from "./AnnouncementImageSlider";
import EditAnnouncementModal from "../EditAnnouncementModal";
import AuthorCard from "../announcementDetail/AuthorCard";
import { API_URL } from "../../config/config";

const GridItemCard = ({
  announcement,
  isUserAnnouncementsPage,
  onRefreshAnnouncements,
  handleNavigateToAnnouncement,
  handleUserView,
}) => {
  // Все хуки должны быть до любого return!
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  useEffect(() => {
    let ignore = false;
    async function fetchImages() {
      setImageLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/ad-images/${announcement.id || announcement._id}`
        );
        const data = await res.json();
        if (!ignore && data && data.data && data.data.length > 0) {
          // Сортируем, чтобы первая была is_main
          const sorted = [...data.data].sort((a, b) =>
            a.is_main === b.is_main ? 0 : a.is_main ? -1 : 1
          );
          setImageUrl(sorted[0].image_url);
        } else {
          setImageUrl(null);
        }
      } catch {
        setImageUrl(null);
      } finally {
        setImageLoading(false);
      }
    }
    fetchImages();
    return () => {
      ignore = true;
    };
  }, [announcement.id, announcement._id]);

  if (!announcement || (!announcement.id && !announcement._id)) {
    return <div style={{ color: "red" }}>Некорректное объявление</div>;
  }

  const handleAuthorCardClick = (e) => {
    e.stopPropagation();
    handleUserView(announcement.user_id);
  };
  const handleEditClick = () => setEditModalOpen(true);
  const handleCloseEditModal = () => setEditModalOpen(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={announcement.id}>
      <Card
        className="announcement-card"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          transition: "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
          boxShadow: 1,
          borderRadius: 2,
          cursor: editModalOpen ? "default" : "pointer",
          position: "relative",
          overflow: "hidden",
          mb: 2,
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 3,
          },
        }}
        onClick={() => {
          if (!editModalOpen) handleNavigateToAnnouncement(announcement.id);
        }}
      >
        {/* Слайдер картинок и иконка редактирования */}
        <AnnouncementImageSlider
          announcementId={announcement.id || announcement._id}
          isUserAnnouncementsPage={isUserAnnouncementsPage}
          onEditAnnouncement={handleEditClick}
        />

        <CardContent
          sx={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
            }}
          >
            {announcement.title}
          </Typography>
          <Typography
            variant="h6"
            color={announcement.price !== null ? "primary" : "text.secondary"}
            sx={{
              mb: 1,
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
        {editModalOpen && (
          <EditAnnouncementModal
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            initialAnnouncement={announcement}
            onUpdated={() => {
              handleCloseEditModal();
              if (typeof onRefreshAnnouncements === "function") {
                onRefreshAnnouncements("update", announcement.id);
              } else {
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
      </Card>
    </Grid>
  );
};

export default GridItemCard;
