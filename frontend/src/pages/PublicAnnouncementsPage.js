import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import ViewAndSortControls from "../components/announcements/ViewAndSortControls";
import AnnouncementList from "../components/announcements/AnnouncementList";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/config"; // Путь к файлу конфигурации

const PublicAnnouncementsPage = () => {
  const { userId } = useParams(); // Идентификатор пользователя из URL
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("newest"); // Режим сортировки
  const [ads, setAds] = useState([]); // Все объявления пользователя
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для загрузки объявлений пользователя
  const fetchUserAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Сопоставление режимов сортировки с параметрами для бэкенда
      const sortMapping = {
        newest: { field: "created_at", order: "DESC" },
        oldest: { field: "created_at", order: "ASC" },
        cheapest: { field: "price", order: "ASC" },
        mostExpensive: { field: "price", order: "DESC" },
      };

      const { field, order } = sortMapping[sortMode] || {};

      // Формируем URL с параметрами
      let url = `${API_URL}/ads/user/${userId}?status=active`;
      if (field && order) {
        url += `&sort=${encodeURIComponent(field)}&order=${encodeURIComponent(
          order
        )}`;
      }
      // Выполняем запрос к серверу (без Authorization header, публичный доступ)
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setAds(data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем объявления при изменении параметров
  useEffect(() => {
    fetchUserAds();
  }, [sortMode]);

  // Если загрузка
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Ошибка загрузки данных: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom>
        Все объявления выбранного пользователя
      </Typography>

      {/* Панель фильтрации и отображения */}
      <Box sx={{ marginBottom: 2 }}>
        <ViewAndSortControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          isMobile={false}
        />
      </Box>

      {/* Список объявлений */}
      <Box>
        {ads.length > 0 ? (
          <AnnouncementList
            ads={ads} // Передаем объявления, полученные от сервера
            viewMode={viewMode}
            onReset={() => {}}
          />
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Нет доступных объявлений
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PublicAnnouncementsPage;
