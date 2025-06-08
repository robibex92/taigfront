import React, { useState, useRef } from "react";
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
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { API_URL } from "../../config/config";
import ImageUploadManager from '../common/ImageUploadManager';
import { TELEGRAM_CHATS, LIST_TELEGRAM_CHATS } from '../../config/telegramChats';
const TELEGRAM_CHATS_SAFE = TELEGRAM_CHATS || {};
const POSTS_ALL_CHATS = (LIST_TELEGRAM_CHATS && LIST_TELEGRAM_CHATS.POSTS_ALL) || [];

const AddPostDialog = ({ refreshPosts }) => {
  // ...
  // (оставить существующие useState)
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    images: [],
    source: "",
    marker: "other", // Default marker
  });
  const [selectedChats, setSelectedChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [pendingImages, setPendingImages] = useState([]); // File[]
  const imageManagerRef = useRef();
  // Кнопка всегда доступна, кроме состояния loading
  const imageRequiredButNotReady = false;

  // Автовыбор всех чатов при выборе маркера "Важное"
  React.useEffect(() => {
    if (newPost.marker === 'important') {
      const defaultKeys = POSTS_ALL_CHATS.map(chatObj => Object.entries(TELEGRAM_CHATS_SAFE).find(([k, v]) => v === chatObj)?.[0]).filter(Boolean);
      setSelectedChats(defaultKeys);
    }
  }, [newPost.marker]);

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
    setSelectedChats([]);
    setError("");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!newPost.title.trim() || !newPost.content.trim()) {
        throw new Error("Заполните все обязательные поля");
      }

      let imageUrl = "";
      // Если выбран файл, сначала загружаем его
      if (pendingImages.length > 0) {
        const file = pendingImages[0];
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch(API_URL + '/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.fileUrl) {
          imageUrl = uploadData.fileUrl;
          if (imageUrl && imageUrl.startsWith('/')) {
            let backendUrl = process.env.REACT_APP_URL_BACKEND;
            if (!backendUrl) {
              backendUrl = window.location.origin;
            }
            imageUrl = backendUrl.replace(/\/$/, '') + imageUrl;
          }
        }
      } else if (newPost.images && newPost.images.length > 0) {
        imageUrl = newPost.images[0];
        if (imageUrl && imageUrl.startsWith('/')) {
          let backendUrl = process.env.REACT_APP_URL_BACKEND;
          if (!backendUrl) {
            backendUrl = window.location.origin;
          }
          imageUrl = backendUrl.replace(/\/$/, '') + imageUrl;
        }
      }

      // 1. Создаем пост с image_url, если он есть
      const postData = {
        title: newPost.title,
        content: newPost.content,
        status: "active",
        source: newPost.source,
        marker: newPost.marker,
        isImportant: newPost.marker === 'important',
      };
      if (imageUrl) {
        postData.image_url = imageUrl;
      }
      if (newPost.marker === 'important' && selectedChats.length > 0) {
        postData.selectedChats = selectedChats;
      }

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
      const postId = responseData.post_id;

      // 3. Закрываем диалог и обновляем список постов
      handleClose();
      setSnackbar({ open: true, message: "Новость успешно создана!", severity: "success" });
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
        <DialogTitle>Форма создания новости</DialogTitle>
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
                    onChange={(e) => {
                      setNewPost((prev) => ({
                        ...prev,
                        marker: e.target.value,
                      }));
                      if (e.target.value !== 'important') setSelectedChats([]);
                    }}
                  >
                    <MenuItem value="important">Важное</MenuItem>
                    <MenuItem value="news">Новости</MenuItem>
                    <MenuItem value="event">События</MenuItem>
                    <MenuItem value="other">Другое</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Выбор чатов только если marker === 'important' */}
              {newPost.marker === 'important' && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="select-chats-label">Telegram-чаты для отправки</InputLabel>
                    <Select
                      labelId="select-chats-label"
                      multiple
                      value={selectedChats}
                      onChange={e => setSelectedChats(e.target.value)}
                      renderValue={selected => selected
  .map(key => TELEGRAM_CHATS_SAFE[key]?.name || key)
  .join(', ')}
                    >
                      {POSTS_ALL_CHATS.map(chatObj => {
  const key = Object.entries(TELEGRAM_CHATS_SAFE).find(([k, v]) => v === chatObj)?.[0];
  return key ? (
  <MenuItem key={key} value={key}>
    <Checkbox checked={selectedChats.includes(key)} />
    {chatObj.name || key}
  </MenuItem>
) : null;
})}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        <ImageUploadManager
          id={null}
          type="post"
          maxImages={1}
          // Не загружаем изображение сразу, только сохраняем для превью
          onImagesChange={() => {}}
          onPendingChange={setPendingImages}
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || imageRequiredButNotReady}
          >
            {loading ? "Создание..." : "Создать"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPostDialog;
