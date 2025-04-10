import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { API_URL } from "../../config/config"; // Путь к файлу конфигурации
import AnnouncementGridView from "../announcements/AnnouncementGridView";
import AnnouncementListView from "../announcements/AnnouncementListView";

const AnnouncementList = ({
  viewMode = "grid", // 'grid' или 'list'
  selectedCategory, // Категория, выбранная пользователем
  selectedSubcategory, // Подкатегория, выбранная пользователем
}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибка при запросе

  // Функция для загрузки объявлений
  const loadAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Очищаем ошибку перед новым запросом

      let url = `${API_URL}/ads?status=active`; // Параметр по умолчанию для статуса

      // Добавляем фильтрацию по категории и подкатегории, если они заданы
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (selectedSubcategory) {
        url += `&subcategory=${encodeURIComponent(selectedSubcategory)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to load ads");
      }

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setAds(data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message); // Сохраняем ошибку, если она есть
    } finally {
      setLoading(false); // Завершаем процесс загрузки
    }
  }, [selectedCategory, selectedSubcategory]); // Добавляем зависимости

  // Загружаем объявления при изменении фильтров
  useEffect(() => {
    loadAds();
  }, [loadAds]); // Добавляем loadAds в зависимости

  // Если объявлений нет и не идет загрузка
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если возникла ошибка
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Ошибка загрузки объявлений: {error}
        </Typography>
      </Box>
    );
  }

  // Если объявлений нет
  if (!ads.length) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Нет доступных объявлений
        </Typography>
      </Box>
    );
  }

  // Отображение в режиме списка или сетки
  if (viewMode === "list") {
    return <AnnouncementListView announcements={ads} />;
  }

  return <AnnouncementGridView announcements={ads} />;
};

export default AnnouncementList;
