import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { API_URL } from "../../config/config";
import ImageUploadManager from "../common/ImageUploadManager"; // Без .jsx

const EditPostDialog = ({ open, onClose, post, onSave }) => {
  const [form, setForm] = useState({
    title: post?.title || "",
    content: post?.content || "",
    image_url: post?.image_url || "",
    source: post?.source || "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        image_url: post.image_url || "",
        source: post.source || "",
      });
    }
  }, [post]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: "Новость обновлена!",
          severity: "success",
        });
        onSave(data.data);
        onClose();
      } else {
        setSnackbar({
          open: true,
          message: "Ошибка при обновлении",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Ошибка при обновлении",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать новость</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Заголовок"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Текст"
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            required
          />
          {/* Загрузка изображения через ImageUploadManager */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <ImageUploadManager
              id={post?.id}
              type="post"
              maxImages={1}
              onImagesChange={(imgs) => {
                // imgs: массив [{id, url, ...}]
                setForm((f) => ({
                  ...f,
                  image_url:
                    imgs && imgs[0]
                      ? imgs[0].image_url || imgs[0].url || ""
                      : "",
                }));
              }}
              fetchUrl={API_URL + "/post-images"}
            />
          </Box>
          <TextField
            label="Ссылка на источник"
            name="source"
            value={form.source}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Сохранить
          </Button>
        </DialogActions>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditPostDialog;
