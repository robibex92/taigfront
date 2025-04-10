import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageUploadSection from "../common/ImageUploadSection";

const API_URL = process.env.REACT_APP_API_URL;

const AddPostDialog = ({ refreshPosts }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    images: [],
    source: "",
    marker: "other", // Default marker
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setNewPost({
      title: "",
      content: "",
      images: [],
      source: "",
      marker: "other",
    });
    setError("");
  };

  const handleImageUpload = async (files) => {
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          return data.url; // Предполагается, что API возвращает URL загруженного изображения
        })
      );

      setNewPost((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Ошибка при загрузке изображений:", error);
      setError("Не удалось загрузить изображения");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!newPost.title.trim() || !newPost.content.trim()) {
        throw new Error("Заполните все обязательные поля");
      }

      // Создаем объект postData
      const postData = {
        title: newPost.title,
        content: newPost.content,
        images: newPost.images,
        source: newPost.source,
        marker: newPost.marker,
      };

      // Отправляем данные через fetch
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать пост");
      }

      const responseData = await response.json();

      // Закрываем диалог и обновляем список постов
      handleClose();
      if (refreshPosts) {
        refreshPosts();
      }
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
      setError(error.message || "Не удалось создать пост");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Добавить новость
      </Button>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Добавить новость</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Заголовок"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Содержание"
                  multiline
                  rows={4}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Источник"
                  value={newPost.source}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, source: e.target.value }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Маркер</InputLabel>
                  <Select
                    value={newPost.marker}
                    label="Маркер"
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        marker: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="important">Важное</MenuItem>
                    <MenuItem value="news">Новости</MenuItem>
                    <MenuItem value="event">События</MenuItem>
                    <MenuItem value="other">Другое</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <ImageUploadSection
                  images={newPost.images}
                  onUpload={handleImageUpload}
                  onRemove={(index) => {
                    setNewPost((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                  }}
                />
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddPostDialog;
