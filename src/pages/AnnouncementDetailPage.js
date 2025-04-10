import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import {
  AnnouncementTitle,
  AnnouncementImageSection,
  AnnouncementAuthorCard,
  AnnouncementContent,
  AnnouncementPrice,
} from "../components/AnnouncementDetail";
import { formatDate } from "../utils/dateUtils";
import { API_URL } from "../config/config"; // Путь к файлу конфигурации
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const AnnouncementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [isViewCountLoading, setIsViewCountLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState(null);
  const [isLoadingNames, setIsLoadingNames] = useState(true);

  const fetchAnnouncement = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/ads/${id}`);
      if (!response.ok) {
        throw new Error("Failed to load announcement");
      }

      const data = await response.json();
      setAnnouncement(data.data);
      setImages(data.images || []);
    } catch (error) {
      console.error("Error loading announcement:", error);
      setError("Ошибка при загрузке объявления");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchViewCount = useCallback(async () => {
    try {
      setIsViewCountLoading(true);
      const response = await fetch(`${API_URL}/ads/${id}/view_count`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update view count");
      }

      const setCountViewCount = await response.json();
      setViewCount(setCountViewCount.view_count);
    } catch (error) {
      console.error("Ошибка обновления счетчика просмотров:", error);
      setViewCount(0);
    } finally {
      setIsViewCountLoading(false);
    }
  }, [id]);

  // Функция для загрузки названий категории и подкатегории
  const fetchCategoryAndSubcategoryNames = async () => {
    try {
      if (!announcement.category || !announcement.subcategory) {
        console.warn(
          "Category or subcategory ID is missing in the announcement"
        );
        return;
      }

      // Загрузка названия категории
      const categoryResponse = await fetch(
        `${API_URL}/categories/${announcement.category}`
      );
      if (!categoryResponse.ok) {
        console.error("API Error:", await categoryResponse.text());
        throw new Error("Failed to load category name");
      }
      const categoryData = await categoryResponse.json();
      console.log("Category Data:", categoryData);

      const categoryNameFromData = Array.isArray(categoryData)
        ? categoryData[0]?.data?.name
        : categoryData?.data?.name;

      setCategoryName(categoryNameFromData);

      // Загрузка названия подкатегории
      const subcategoryResponse = await fetch(
        `${API_URL}/categories/${announcement.category}/subcategories/${announcement.subcategory}`
      );
      if (!subcategoryResponse.ok) {
        console.error("API Error:", await subcategoryResponse.text());
        throw new Error("Failed to load subcategory name");
      }
      const subcategoryData = await subcategoryResponse.json();
      console.log("Subcategory Data:", subcategoryData);

      const subcategoryNameFromData = Array.isArray(subcategoryData)
        ? subcategoryData[0]?.subcategory?.name
        : subcategoryData?.subcategory?.name;

      setSubcategoryName(subcategoryNameFromData);
    } catch (error) {
      console.error("Error loading category/subcategory names:", error);
    } finally {
      setIsLoadingNames(false);
    }
  };

  useEffect(() => {
    if (announcement) {
      fetchCategoryAndSubcategoryNames();
    }
  }, [announcement]);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  useEffect(() => {
    fetchViewCount();
  }, [fetchViewCount]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !announcement) {
    return (
      <Alert severity="error">
        Не удалось загрузить объявление. Возможно, оно было удалено.
        <Button onClick={() => navigate("/ads")}>
          Вернуться к объявлениям
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/ads")}
        sx={{ mb: 2 }}
      >
        Назад к объявлениям
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <AnnouncementTitle title={announcement.title} />

        <AnnouncementImageSection images={images} />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <AnnouncementContent
              description={announcement.description}
              categoryName={categoryName}
              subcategoryName={subcategoryName}
              viewCount={viewCount}
              createdAt={formatDate(announcement.created_at)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {announcement.user ? (
              <AnnouncementAuthorCard
                user={announcement.user}
                onUserClick={(user) => navigate(`/ads/${user.user_id}`)}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Информация о пользователе недоступна.
              </Typography>
            )}

            <AnnouncementPrice price={announcement.price} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AnnouncementDetailPage;
