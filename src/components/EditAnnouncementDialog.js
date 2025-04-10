import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import AnnouncementForm from "./AnnouncementForm";
import { API_URL } from "../config/config"; // Путь к файлу конфигурации

const EditAnnouncementDialog = ({ open, onClose, onSuccess, announcement }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Отправляем данные на сервер через fetch
      const response = await fetch(`${API_URL}/ads/${announcement.id}`, {
        method: "PUT", // Используем метод PUT для обновления
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      const data = await response.json();

      // Вызываем onSuccess с обновленным объявлением
      onSuccess(data);

      // Закрываем диалоговое окно
      onClose();
    } catch (error) {
      setError(error.message || "Произошла ошибка при обновлении объявления");
    } finally {
      setLoading(false);
    }
  };

  if (!announcement) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Редактирование объявления
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <AnnouncementForm
          onSubmit={handleSubmit}
          initialData={announcement}
          loading={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAnnouncementDialog;
