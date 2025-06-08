import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
  useTheme,
  Snackbar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import Title from "../components/announcementDetail/Title";
import ImageSection from "../components/announcementDetail/ImageSection";
import Content from "../components/announcementDetail/Content";
import Price from "../components/announcementDetail/Price";
import AuthorCard from "../components/announcementDetail/AuthorCard";
import TelegramIcon from "@mui/icons-material/Telegram";
import { API_URL } from "../config/config";
import MessageDialog from '../components/MessageDialog';
import { useAuth } from '../context/AuthContext';

const AnnouncementDetailPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [msgDialogOpen, setMsgDialogOpen] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');

  // msgError и setMsgError удалены, больше не используются
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [announcement, setAnnouncement] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState(null);

  const fetchAnnouncement = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/ads/${id}`);
      if (!response.ok) throw new Error("Failed to load announcement");
      const data = await response.json();
      setAnnouncement(data.data);
    } catch (error) {
      console.error("Error loading announcement:", error);
      setError("Ошибка при загрузке объявления");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchViewCount = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/ads/${id}/view_count`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to update view count");

      const data = await response.json();
      setViewCount(data.view_count);
    } catch (error) {
      console.error("Ошибка обновления счетчика просмотров:", error);
      setViewCount(0);
    }
  }, [id]);

  const fetchCategoryNames = async () => {
    try {
      if (!announcement?.category || !announcement?.subcategory) return;

      // Fetch category name
      const categoryRes = await fetch(
        `${API_URL}/categories/${announcement.category}`
      );
      const categoryData = await categoryRes.json();
      setCategoryName(
        Array.isArray(categoryData)
          ? categoryData[0]?.data?.name
          : categoryData?.data?.name
      );

      // Fetch subcategory name
      const subcategoryRes = await fetch(
        `${API_URL}/categories/${announcement.category}/subcategories/${announcement.subcategory}`
      );
      const subcategoryData = await subcategoryRes.json();
      setSubcategoryName(
        Array.isArray(subcategoryData)
          ? subcategoryData[0]?.subcategory?.name
          : subcategoryData?.subcategory?.name
      );
    } catch (error) {
      console.error("Error loading category names:", error);
    }
  };

  useEffect(() => {
    if (announcement) fetchCategoryNames();
  }, [announcement]);

  useEffect(() => {
    fetchAnnouncement();
    fetchViewCount();
  }, [fetchAnnouncement, fetchViewCount]);

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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/ads")}
            >
              Назад
            </Button>
          }
        >
          Не удалось загрузить объявление. Возможно, оно было удалено.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/ads")}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Назад к объявлениям
      </Button>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, md: 2 },
          borderRadius: 2,
          boxShadow: theme.shadows[4],
        }}
      >
        {/* Заголовок */}
        <Title title={announcement.title} />

        {/* Блок (с изображением) */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <ImageSection
              announcement={announcement}
              sx={{
                height: "100%",
                minHeight: 400,
              }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              {/* Цена */}
              <Price formattedPrice={announcement.price} />
              {/* Информация об авторе и кнопка*/}
              <Card>
                <CardContent>
                  <AuthorCard user_id={announcement.user_id} />
                </CardContent>
              </Card>
              {/* Кнопка */}
              <Button
                variant="contained"
                startIcon={<TelegramIcon />}
                fullWidth
                onClick={() => setMsgDialogOpen(true)}
              >
                Написать автору
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Разделитель */}
        <Divider sx={{ my: 3 }} />

        {/* Основное содержимое объявления */}

        {/* Категории и просмотры */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {categoryName && (
              <Chip
                label={`Категория: ${categoryName}`}
                variant="outlined"
                size="small"
              />
            )}
            {subcategoryName && (
              <Chip
                label={`Подкатегория: ${subcategoryName}`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon fontSize="small" color="action" />

            <Typography variant="body2" color="text.secondary">
              {viewCount}{" "}
              {viewCount === 1
                ? "просмотр"
                : viewCount > 1 && viewCount < 5
                ? "просмотра"
                : "просмотров"}
            </Typography>
          </Box>
        </Box>

        {/* Описание */}

        <Content content={announcement.content} />
      </Paper>
      <MessageDialog
        open={msgDialogOpen}
        onClose={() => setMsgDialogOpen(false)}
        targetChatId={announcement?.user_id}
        contextType="announcement"
        contextData={{ title: announcement?.title }}
        isAuthenticated={isAuthenticated}
      />
      {/* Snackbar уведомления */}
      {msgSuccess && (
        <Snackbar open autoHideDuration={3000} onClose={() => setMsgSuccess('')}>
          <Alert severity="success">{msgSuccess}</Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default AnnouncementDetailPage;
