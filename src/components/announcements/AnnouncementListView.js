import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  Chip,
} from "@mui/material";
import AnnouncementImageSlider from "./AnnouncementImageSlider";
import AnnouncementView, { UserAvatarChip } from "./AnnouncementView";

const AnnouncementListView = ({
  announcements = [],
  loading,
  isUserAnnouncementsPage = false,
  onRefreshAnnouncements,
}) => {
  const renderContent = ({
    announcements,
    //handleImageSlide,
    handleUserView,
    handleNavigateToAnnouncement,
    isUserAnnouncementsPage,
    onRefreshAnnouncements,
  }) => (
    <List>
      {announcements.map((announcement) => (
        <ListItem
          key={announcement.id}
          component="div" // Убираем button и используем div
          sx={{
            cursor: "pointer", // Делаем элемент кликабельным
            "&:hover": {
              backgroundColor: "action.hover", // Добавляем эффект при наведении
            },
          }}
          onClick={() => handleNavigateToAnnouncement(announcement.id)}
        >
          <Card
            className="announcement-card"
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
            {/* Слайдер изображений */}
            <AnnouncementImageSlider
              announcementId={announcement.id} // Передаем только ID объявления
              isUserAnnouncementsPage={isUserAnnouncementsPage}
              onRefreshAnnouncements={onRefreshAnnouncements}
              sx={{
                flex: "0 0 30%",
                minHeight: 200,
                maxHeight: 200,
              }}
            />

            {/* Основное содержимое карточки */}
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: 1,
              }}
            >
              {/* Заголовок объявления */}
              <Typography
                variant="subtitle1"
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

              {/* Цена объявления */}
              {announcement.price !== null ? (
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{ mb: 0.5 }}
                >
                  {announcement.price} ₽
                </Typography>
              ) : (
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    mb: 0.5,
                    fontStyle: "italic",
                  }}
                >
                  Цена не указана
                </Typography>
              )}

              {/* Категория и подкатегория */}
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                {announcement.category_name && (
                  <Chip
                    label={announcement.category_name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {announcement.subcategory_name && (
                  <Chip
                    label={announcement.subcategory_name}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Пользователь, создавший объявление */}
              {announcement.users && (
                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    justifyContent: "flex-start",
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
        </ListItem>
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

export default AnnouncementListView;
