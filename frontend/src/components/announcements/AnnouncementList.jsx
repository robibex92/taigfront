import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import GridView from "../announcements/GridView";
import ListView from "../announcements/ListView";

const AnnouncementList = ({
  viewMode = "grid", // 'grid' или 'list'
  ads = [], // Все объявления пользователя (уже загружены)
  activeTab = "active", // Текущая активная вкладка
  sortMode = "newest", // Сортировка, выбранная пользователем
  isUserAnnouncementsPage = false, // Add isUserAnnouncementsPage as a prop
  onRefreshAnnouncements, // Добавляем этот проп
}) => {
  // Используем объявления без дополнительной фильтрации,
  // так как они уже отфильтрованы в родительском компоненте
  const sortedAds = ads;

  // Сортировка объявлений (закомментировано, так как сортировка происходит на уровне API)
  // const sortMapping = {
  //   newest: { field: "created_at", order: "desc" },
  //   oldest: { field: "created_at", order: "asc" },
  //   cheapest: { field: "price", order: "asc" },
  //   mostExpensive: { field: "price", order: "desc" },
  // };

  // Если объявлений нет
  if (!sortedAds.length) {
    let message = "Нет доступных объявлений";
    if (activeTab === "active") {
      message = "У вас нет активных объявлений";
    } else if (activeTab === "archive") {
      message = "У вас нет архивных объявлений";
    } else if (activeTab === "deleted") {
      message = "У вас нет удаленных объявлений";
    }

    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  // Отображение в режиме списка или сетки
  return viewMode === "list" ? (
    <ListView
      announcements={sortedAds}
      isUserAnnouncementsPage={isUserAnnouncementsPage}
      onRefreshAnnouncements={onRefreshAnnouncements}
    />
  ) : (
    <GridView
      announcements={sortedAds}
      isUserAnnouncementsPage={isUserAnnouncementsPage}
      onRefreshAnnouncements={onRefreshAnnouncements}
    />
  );
};

export default AnnouncementList;
